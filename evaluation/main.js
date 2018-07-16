function evaluateRules(passedRuleset) {
    console.log('Entered evaluateRules()');
    var doc = window.document;
    var ruleset = OpenAjax.a11y.RulesetManager.getRuleset(passedRuleset);
    var evaluator_factory = OpenAjax.a11y.EvaluatorFactory.newInstance();
    evaluator_factory.setParameter('ruleset', ruleset);
    evaluator_factory.setFeature('eventProcessing', 'fae-util');
    evaluator_factory.setFeature('groups', 7);
    var evaluator = evaluator_factory.newEvaluator();
    var evaluation = evaluator.evaluate(doc, doc.title, doc.location.href);
    var out = evaluation.toJSON(true);
    console.log(out);
    return out;
}