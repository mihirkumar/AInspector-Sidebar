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

  // Hide all view options

  hide('summary_panel');
  hide('group_panel');
  hide('rule_panel');

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

    case 'rule':
      show('rule_panel');
      updateTitle('Rule Result');
      updateRulePanel(evaluationResult);
      break;

    default:
      break;

  }

}

// Group events and messages

function handleUpdateEvaluation() {

  browser.tabs.query({
      currentWindow: true,
      active: true
  }).then(sendMessageToTabs).catch(onError);
}

function handleGetGroup(id) {

  var groupType = id.substring(0,2);
  var groupId   = id.split('-')[1];

  messageArgs.option    = 'group';
  messageArgs.groupType = groupType;
  messageArgs.groupId   = parseInt(groupId);

  backButton.disabled = false;

  browser.tabs.query({
      currentWindow: true,
      active: true
  }).then(sendMessageToTabs).catch(onError);
};

function handleGetRule(id) {

  messageArgs.option  = 'rule';
  messageArgs.ruleId  = id;

  backButton.disabled = false;

  browser.tabs.query({
      currentWindow: true,
      active: true
  }).then(sendMessageToTabs).catch(onError);
};


// Add event handlers

var messageArgs = {
  option: 'summary',
  ruleset: 'ARIA_STRICT',
  groupType: 'rc',
  groupId: 1,
  rule: 'LANDMARK_1'
};

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      messageArgs
    ).then(response => {
      var evaluationResult = response.response;
      changePanelElements(evaluationResult);
    }).catch(onError);
  }
};

var evaluateButton = document.getElementById('evaluate');
evaluateButton.addEventListener("click", handleUpdateEvaluation);

window.addEventListener("load", function(){
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendMessageToTabs).catch(onError);
});

// Back button

function handleBack(event) {
  var update = false;

  switch (messageArgs.option) {
    case 'group':
      messageArgs.option = 'summary';
      backButton.disabled = true;
      update = true;
      showSummaryPanel();
      hideGroupPanel();
      break;

    case 'rule':
      messageArgs.option = 'group';
      update = true;
      showGroupPanel();
      hideRulePanel();
      break;

    default:
      break;
  }

  if (update) {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendMessageToTabs).catch(onError);
  }
};

var backButton = document.getElementById('back');
backButton.addEventListener('click', handleBack);

// Initialize panel

clearSummaryPanel();
clearGroupPanel();

showSummaryPanel();
hideGroupPanel();
hideRulePanel();

backButton.disabled = true;
