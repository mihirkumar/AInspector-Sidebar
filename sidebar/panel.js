"use strict";

var evaluateButton = document.getElementById('evaluate');

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


  function addGroupResultRow(label, v, w, mc, p) {
    var html = '<tr>'
    html += '  <th>' + label + '</th>';
    html += '  <td>' + v     + '</td>';
    html += '  <td>' + w     + '</td>';
    html += '  <td>' + mc    + '</td>';
    html += '  <td>' + p     + '</td>';
    html += '</tr>'

    return html;
  }


  if (evaluationResult.option == 'summary') {
    document.getElementById("location").innerHTML = "Location: " + evaluationResult.url;
    document.getElementById("ruleset").innerHTML = "Ruleset: " + evaluationResult.ruleset;

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

      html += addGroupResultRow(gr.label, gr.violations, gr.warnings, gr.manual_checks, gr.passed);
    }

    html += addGroupResultRow('All', evaluationResult.violations, evaluationResult.warnings, evaluationResult.manual_checks, evaluationResult.passed);
    node.innerHTML = html;
  }

}

function sendMessageToTabs(tabs) {
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

evaluateButton.addEventListener("click", function(){
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendMessageToTabs).catch(onError);
});

window.addEventListener("load", function(){
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendMessageToTabs).catch(onError);
});
