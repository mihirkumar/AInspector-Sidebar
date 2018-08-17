"use strict";

function onError(error) {
  console.error(`Error: ${error}`);
}

browser.runtime.onMessage.addListener(notify);

function notify(message) {
  if (message.messageForPanel) {
    changePanelElements(message.messageForPanel);
  }
}

function changePanelElements(evaluationResult) {

  function hide(id) {
    var node = document.getElementById(id);

    if (node) {
      node.style.display = 'none';
    }
  }

  function show(id) {
    var node = document.getElementById(id);

    if (node) {
      node.style.display = 'block';
    }
  }

  function addGroupResultRow(id, label, v, w, mc, p) {
    var html = '<tr>'
    html += '  <th><a href="#" id="' + id + '">' + label + '</a></th>';
//    html += '  <th>' + label + '</th>';
    html += '  <td>' + v     + '</td>';
    html += '  <td>' + w     + '</td>';
    html += '  <td>' + mc    + '</td>';
    html += '  <td>' + p     + '</td>';
    html += '</tr>'

    return html;
  }

  // Hide all view options

  hide('summary_grid');
  hide('group_grid');

  document.getElementById("location").innerHTML = evaluationResult.url;
  document.getElementById("ruleset").innerHTML = evaluationResult.ruleset;

  if (evaluationResult.option == 'summary') {
    show('summary_grid');

    // update Rule Summary
    document.getElementById("violations").innerHTML      = evaluationResult.violations;
    document.getElementById("warnings").innerHTML        = evaluationResult.warnings;
    document.getElementById("manual_checks").innerHTML   = evaluationResult.manual_checks;
    document.getElementById("passed").innerHTML          = evaluationResult.passed;

    // Update Group Results

    var html = '';
    var node = document.getElementById("group_results");


    for (let i = 0; i < evaluationResult.groupResults.length; i++) {
      var gr = evaluationResult.groupResults[i];

      html += addGroupResultRow(gr.id, gr.label, gr.violations, gr.warnings, gr.manual_checks, gr.passed);
    }

    html += addGroupResultRow('all', 'All', evaluationResult.violations, evaluationResult.warnings, evaluationResult.manual_checks, evaluationResult.passed);
    node.innerHTML = html;

    var buttons = node.getElementsByTagName('a');

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', handleGroupButton);
    }

  }

  if (evaluationResult.option == 'group') {
    show('group_grid');

    // update Rule Summary
    document.getElementById("violations").innerHTML      = evaluationResult.violations;
    document.getElementById("warnings").innerHTML        = evaluationResult.warnings;
    document.getElementById("manual_checks").innerHTML   = evaluationResult.manual_checks;
    document.getElementById("passed").innerHTML          = evaluationResult.passed;

    // Update Group Results

    var html = '';
    var node = document.getElementById("_results");


    for (let i = 0; i < evaluationResult.groupResults.length; i++) {
      var gr = evaluationResult.groupResults[i];

      html += addGroupResultRow(gr.id, gr.label, gr.violations, gr.warnings, gr.manual_checks, gr.passed);
    }

    html += addGroupResultRow('all', 'All', evaluationResult.violations, evaluationResult.warnings, evaluationResult.manual_checks, evaluationResult.passed);
    node.innerHTML = html;

    var buttons = node.getElementsByTagName('button');

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', handleGroupButton);
    }

  }

}

// Summary events and messages

function sendGetSummaryMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {clicked: true, option: 'summary'}
    ).then(response => {
      var evaluationResult = response.response;
      changePanelElements(evaluationResult);
    }).catch(onError);
  }
}

var evaluateButton = document.getElementById('evaluate');
evaluateButton.addEventListener("click", function(){
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendGetSummaryMessageToTabs).catch(onError);
});

window.addEventListener("load", function(){
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendGetSummaryMessageToTabs).catch(onError);
});

// Group events and messages

function sendGetGroupMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {clicked: true, option: 'group', group: 1}
    ).then(response => {
      var evaluationResult = response.response;
      changePanelElements(evaluationResult);
    }).catch(onError);
  }
}

function handleGroupButton(event) {
  alert(event.currentTarget.id);
  browser.tabs.query({
      currentWindow: true,
      active: true
  }).then(sendGetGroupMessageToTabs).catch(onError);
}

