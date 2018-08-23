"use strict";

var evaluateButton = document.getElementById('evaluate');
var radios = document.forms["Persistence"].elements["car"];

var storedValue = browser.storage.local.get("car");
alert(storedValue);

// for(var i = 0, max_i = radios.length; i < max; i++) {
//   radios[i].onclick = function() 
//     var storedData = {"car": this.value};
//   }
// }

for(var j = 0, max_j = radios.length; j < max_j; j++) {
  radios[j].onclick = function() {
    browser.storage.local.set({"car": this.value});
    alert(this.value);
  }
}

browser.contextMenus.create({
  id: "ainspector",
  title: "Run ARIA evaluation",
  contexts: ["all"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ainspector") {
    evaluateButton.click();
  }
});

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
  exportToPdf();
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

function exportToPdf() {
  var doc = new jsPDF()
  doc.text('Hello world!', 10, 10)
  doc.save('a4.pdf')
}
