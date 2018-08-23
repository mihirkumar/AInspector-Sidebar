"use strict";

var ruleLabels = ['Rule 1 ....', 'Rule 2 ....', 'Rule 3 ....', 'Rule 4 ....', 'Rule 5 ....', 'Rule 6 ....'];

function hideGroupPanel() {
  hide('group_panel');
}

function showGroupPanel() {
  show('group_panel');
}

function addRuleResultRow(rule_id, summary, result, wcag, level, required) {
  var html = '<tr>'
  html += '  <th><a href="#" id="' + rule_id + '">' + summary + '</a></th>';
  html += '  <td class="' + result.toLowerCase() + '">' + result + '</td>';
  html += '  <td>' + wcag  + '</td>';
  html += '  <td>' + level + '</td>';
  html += '  <td>' + (required ? 'Y' : '') + '</td>';
  html += '</tr>'

  return html;
}

function clearGroupPanel() {

  // update Rule Summary
  document.getElementById("group_violations").innerHTML      = '-';
  document.getElementById("group_warnings").innerHTML        = '-';
  document.getElementById("group_manual_checks").innerHTML   = '-';
  document.getElementById("group_passed").innerHTML          = '-';

  // Update Group Results

  var html = '';
  var node = document.getElementById("rule_results");

  for (let i = 0; i < ruleLabels.length; i++) {
    html += addRuleResultRow('', ruleLabels[i], '-', '-', '-', false);
  }

  node.innerHTML = html;

}

function updateGroupPanel(evaluationResult) {

  // update Rule Summary
  document.getElementById("group_violations").innerHTML      = evaluationResult.violations;
  document.getElementById("group_warnings").innerHTML        = evaluationResult.warnings;
  document.getElementById("group_manual_checks").innerHTML   = evaluationResult.manual_checks;
  document.getElementById("group_passed").innerHTML          = evaluationResult.passed;

  // Update Group Results

  var html = '';
  var node = document.getElementById("rule_results");

  for (let i = 0; i < evaluationResult.ruleResults.length; i++) {
    var rr = evaluationResult.ruleResults[i];
    html += addRuleResultRow(rr.rule_id, rr.summary, rr.result, rr.wcag, rr.level, rr.required);
  }

  node.innerHTML = html;

  var buttons = node.getElementsByTagName('a');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (event) {var rule_id = event.currentTarget.id; handleGetRule(rule_id);});
  }

}

