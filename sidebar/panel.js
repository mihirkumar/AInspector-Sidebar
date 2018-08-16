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

function changePanelElements(receivedObject) {
  if (receivedObject.option == 'summary') {
    document.getElementById("location").innerHTML = "Location: " + receivedObject.url;
    document.getElementById("ruleset").innerHTML = "Ruleset: " + receivedObject.ruleset;

    // update Rule Summary
    document.getElementById("violations").innerHTML      = receivedObject.violations;
    document.getElementById("warnings").innerHTML        = receivedObject.warnings;
    document.getElementById("manual_checks").innerHTML   = receivedObject.manual_checks;
    document.getElementById("passed").innerHTML          = receivedObject.passed;
  }

}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {clicked: true, option: 'summary'}
    ).then(response => {
      var receivedObject = response.response;
      changePanelElements(receivedObject);
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
