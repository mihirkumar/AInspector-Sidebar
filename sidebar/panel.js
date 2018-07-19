"use strict";

var evaluateButton = document.getElementById('evaluate');

function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {clicked: true}
    ).then(response => {
      console.log("Message from the content script:");
      alert(response.response);
    }).catch(onError);
  }
}

evaluateButton.addEventListener("click", function(){
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(sendMessageToTabs).catch(onError);
});




// function executing(){
//     // console.log('we are in');
//     alert('im in dud');
    
//     // browser.tabs.executeScript({code: 'alert("button was pressed my dude!")'});
//     // console.log('heya!');
// }

// evaluateButton.addEventListener("click", executing);