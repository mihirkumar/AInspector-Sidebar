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

  function updateTitle(title) {
    var node = document.getElementById('title');

    if (node) {
      node.innerHTML = title;
    }
  }

  // Hide all view options

  hide('summary_panel');
  hide('group_panel');
  hide('rule_panel');
  hide('preferences_panel');

  document.getElementById("location").innerHTML = evaluationResult.url;
  document.getElementById("ruleset").innerHTML = evaluationResult.ruleset;

  switch(evaluationResult.option) {
    case 'summary':
      show('summary_panel');
      updateTitle("Summary");
      updateSummaryPanel(evaluationResult);
      break;

    case 'group':
      show('group_panel');
      updateTitle(evaluationResult.groupLabel);
      updateGroupPanel(evaluationResult);
      break;

    default:
      break;

  }

}

// Summary events and messages

var message_args = {
  option: 'summary',
  ruleset: 'ARIA_STRICT',
  groupType: 'rc',
  groupId: 1,
  rule: 'LANDMARK_1'
}

function sendGetSummaryMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      message_args
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
  browser.tabs.query({
      currentWindow: true,
      active: true
  }).then(sendGetGroupMessageToTabs).catch(onError);
}

