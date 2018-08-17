"use strict";

function handleError(error) {
  console.log(`Error: ${error}`);
}

window.onload = function notifyPanel() {
  console.log('[onload][Start]');

  // to be run when the window finishes loading
  var aiResponse = summary();

  var sending = browser.runtime.sendMessage({
    messageForPanel: aiResponse
  });
  sending.then(handleError);
}

function evaluateRules(ruleset) {
  console.log('[evaluateRules][Start]: ' + ruleset);

  if (ruleset !== 'ARIA_TRANS' && ruleset !== 'ARIA_STRICT') {
    ruleset = 'ARIA_STRICT';
  }

  // evaluation script
  var doc = window.document;
  var rs = OpenAjax.a11y.RulesetManager.getRuleset(ruleset);
  var evaluator_factory = OpenAjax.a11y.EvaluatorFactory.newInstance();
  evaluator_factory.setParameter('ruleset', rs);
  evaluator_factory.setFeature('eventProcessing', 'fae-util');
  evaluator_factory.setFeature('groups', 7);
  var evaluator = evaluator_factory.newEvaluator();
  var evaluationResult = evaluator.evaluate(doc, doc.title, doc.location.href);
  // var out = evaluation.toJSON(true);
  console.log('[evaluateRules][End]: ' + evaluationResult);
  return evaluationResult;
}

function getCommonData(evaluationResult) {
  console.log('[getCommonData][Start]');
  // gets required data from evaluation object to return to panel
  var aiResponse = new Object();
  aiResponse.url = evaluationResult.getURL();
  aiResponse.ruleset = evaluationResult.getRuleset().getId();
  console.log('[getCommonData][End]: ' + aiResponse);
  return aiResponse;
}

function addSummaryData(aiResponse, evaluationResult) {
  console.log('[getSummaryData][Start]');
  var ruleGroupResult = evaluationResult.getRuleResultsAll();
  var ruleSummaryResult = ruleGroupResult.getRuleResultsSummary();

  aiResponse.violations    = ruleSummaryResult.violations;
  aiResponse.warnings      = ruleSummaryResult.warnings;
  aiResponse.manual_checks = ruleSummaryResult.manual_checks;
  aiResponse.passed        = ruleSummaryResult.passed;

  console.log('[getSummaryData][End]');
}

function addRuleCategoryData(aiResponse, evaluationResult) {
  console.log('[addRuleCategoryData][Start]');


  function addItem(ruleCategoryId, label) {
    console.log('[addRuleCategoryData][addItem]: ' + ruleCategoryId + ' ' + label);

    var summary = evaluationResult.getRuleResultsByCategory(ruleCategoryId).getRuleResultsSummary();
    console.log('[addRuleCategoryData][addItem][summary]: ' + summary);

    var item = { 'id'             : ruleCategoryId,
                 'label'          : label,
                 'violations'     : summary.violations,
                 'warnings'       : summary.warnings,
                 'manual_checks'  : summary.manual_checks,
                 'passed'         : summary.passed,
                 'not_applicable' : summary.not_applicable
               };

    aiResponse.groupResults.push(item);

  }

  aiResponse.groupResults = [];

  addItem(OpenAjax.a11y.RULE_CATEGORIES.LANDMARKS, 'Landmarks');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.HEADINGS, 'Headings');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.STYLES_READABILITY, 'Styles/Content');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.IMAGES, 'Images');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.LINKS, 'Links' );
  addItem(OpenAjax.a11y.RULE_CATEGORIES.FORMS, 'Forms');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.TABLES, 'Tables');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS, 'Widgets/Scripts');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.AUDIO_VIDEO, 'Audio/Video');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.KEYBOARD_SUPPORT, 'Keyboard');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.TIMING, 'Timing');
  addItem(OpenAjax.a11y.RULE_CATEGORIES.SITE_NAVIGATION, 'Site Navigation');

  console.log('[addRuleCategoryData][End]');
}

function summary(ruleset) {
  console.log('[summary][Start]');
  var evaluationResult = evaluateRules(ruleset);
  var aiResponse = getCommonData(evaluationResult);
  addSummaryData(aiResponse, evaluationResult);
  addRuleCategoryData(aiResponse, evaluationResult);
  aiResponse.option = 'summary'

  console.log('[summary][URL]: '     + aiResponse.url);
  console.log('[summary][Ruleset]: ' + aiResponse.ruleset);
  console.log('[summary][End]: '     + aiResponse);
  return aiResponse;
}

browser.runtime.onMessage.addListener(request => {
  // to be executed on receiving messages from the panel

  var aiResponse;

  if (typeof request.option !== 'string') {
    request.option = 'summary';
  }

  if (typeof request.ruleset !== 'string') {
    request.ruleset = 'ARIA_STRICT';
  }

  console.log("[onMessage][start]");
  console.log('[onMessage][option]: ' + request.option);
  console.log('[onMessage][ruleset]: ' + request.ruleset);

  switch (request.option) {
    case 'summary':
    default:
      aiResponse = summary(request.ruleset);
    break;

  }

  console.log('[onMessage][End]:' + aiResponse);
  return Promise.resolve({response: aiResponse});
});
