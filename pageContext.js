"use strict";

function handleError(error) {
  console.log(`Error: ${error}`);
}

window.onload = function notifyPanel() {
  // to be run when the window finishes loading
  var outputForPanel = processing();
  var sending = browser.runtime.sendMessage({
    messageForPanel: outputForPanel
  });
  sending.then(handleError);
}

function evaluateRules() {
  // evaluation script
  console.log('Entered evaluateRules()');
  var doc = window.document;
  var ruleset = OpenAjax.a11y.RulesetManager.getRuleset("ARIA_STRICT");
  var evaluator_factory = OpenAjax.a11y.EvaluatorFactory.newInstance();
  evaluator_factory.setParameter('ruleset', ruleset);
  evaluator_factory.setFeature('eventProcessing', 'fae-util');
  evaluator_factory.setFeature('groups', 7);
  var evaluator = evaluator_factory.newEvaluator();
  var evaluation = evaluator.evaluate(doc, doc.title, doc.location.href);
  var out = evaluation.toJSON(true);
  console.log(out);
  return evaluation;
}

function getRequiredData(evaluation) {
  // gets required data from evaluation object to return to panel
  var outputObject = new Object();
  outputObject.url = evaluation.getURL();
  outputObject.ruleset = evaluation.getRuleset().getId();
  console.log(evaluation.getRuleset().getId());
  return outputObject;
}

function processing() {
  var evaluation = evaluateRules();
  var output = getRequiredData(evaluation);

  return output;
}

browser.runtime.onMessage.addListener(request => {
  // to be executed on receiving messages from the panel
  console.log("Message from the background script:");
  console.log(request.clicked);

  var outputForPanel = processing();

  return Promise.resolve({response: outputForPanel});
});
