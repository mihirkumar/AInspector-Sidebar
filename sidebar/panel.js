"use strict";

var evaluateButton = document.getElementById('evaluate');

function onError(error) {
  console.error(`Error: ${error}`);
}

browser.runtime.onMessage.addListener(notify);

function notify(message) {
  changePanelElements(message.messageForPanel);
}

function changePanelElements(receivedObject) {
  document.getElementById("location").innerHTML = "Location: " + receivedObject.url;
  document.getElementById("ruleset").innerHTML = "Ruleset: " + receivedObject.ruleset;
}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {clicked: true}
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
