"use strict";

var ruleLabels = ['Rule 1 ....', 'Rule 2 ....', 'Rule 3 ....', 'Rule 4 ....', 'Rule 5 ....', 'Rule 6 ....'];

function hideGroupPanel() {
  hide('group_panel');
}

function showGroupPanel() {
  show('group_panel');
}

function addRuleResultRow(rule_id, summary, result, wcag, level, required) {
  var row = groupGrid.addRow(rule_id, handleGroupGridAction);

  row.addCell(summary, 'text rule', '', true);
  row.addCell(result,  'value result' + result.toLowerCase(), result);
  row.addCell(level,    'value sc', level);
  row.addCell(level,   'value level', level);
  row.addCell((required ? 'Y' : ''), 'value required', (required ? 'Y' : ''));

}

function clearGroupPanel() {

  // update Rule Summary
  document.getElementById("group_violations").innerHTML      = '-';
  document.getElementById("group_warnings").innerHTML        = '-';
  document.getElementById("group_manual_checks").innerHTML   = '-';
  document.getElementById("group_passed").innerHTML          = '-';

  // Update Group Results

  var cells = document.querySelectorAll('tbody#rule_results td');

  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = '-';
  }

}

function updateGroupPanel(evaluationResult) {

  function getDetailsAction(ruleResults, ruleId) {

    var da = ruleResults[0].detailsAction;

    for (let i = 0; i < ruleResults.length; i++) {
      if (ruleResults[i].ruleId === ruleId) {
        da = ruleResults[i].detailsAction;
        return da;
      }
    }

    return da;
  }


  // update Rule Summary
  document.getElementById("group_violations").innerHTML      = evaluationResult.violations;
  document.getElementById("group_warnings").innerHTML        = evaluationResult.warnings;
  document.getElementById("group_manual_checks").innerHTML   = evaluationResult.manual_checks;
  document.getElementById("group_passed").innerHTML          = evaluationResult.passed;

  // Update Group Results

  var ruleResults = evaluationResult.ruleResults;

  for (let i = 0; i < ruleResults.length; i++) {
    var rr = ruleResults[i];
    addRuleResultRow(rr.ruleId, rr.summary, rr.result, rr.wcag, rr.level, rr.required);
  }

/*
  node.innerHTML = html;

  var buttons = node.getElementsByTagName('a');

  for (let i = 0; i < buttons.length; i++) {

    buttons[i].addEventListener('click', function (event) {var ruleId = event.currentTarget.id; handleGetRule(ruleId);});
    buttons[i].addEventListener('focus', function (event) {var da = getDetailsAction(ruleResults, event.currentTarget.id); updateDetailsAction('rr', da);});
    buttons[i].addEventListener('mouseover', function (event) {var da = getDetailsAction(ruleResults, event.currentTarget.id); updateDetailsAction('rr', da);});
  }
*/
}

function handleGroupGridAction(type, ruleId) {


  switch (type) {
    case 'activate':
      handleGetRule(ruleId)
      break;

    case 'click':
      break;

    case 'doubleClick':
      break;

    case 'focus':
      detailsRuleButton.disabled = false;
      break;

  }
};

// Details Rule Button

function handleDetailsRule(event) {

  var id = groupGrid.getSelectedId();

  if (id) {
    handleGetRule(id);
  }
};

var detailsRuleButton = document.getElementById('details_rule');
detailsRuleButton.addEventListener('click', handleDetailsRule);
