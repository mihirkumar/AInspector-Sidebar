"use strict";

function updateGroupPanel(evaluationResult) {

  function addRuleResultRow(id, label, req, v, w, mc, p, h) {
    var html = '<tr>'
    html += '  <th><a href="#" id="' + id + '">' + label + '</a></th>';
    html += '  <td>' + (req ? 'Y' : '') + '</td>';
    html += '  <td>' + v     + '</td>';
    html += '  <td>' + w     + '</td>';
    html += '  <td>' + mc    + '</td>';
    html += '  <td>' + p     + '</td>';
    html += '  <td>' + h     + '</td>';
    html += '</tr>'

    return html;
  }

  // update Rule Summary
  document.getElementById("group_violations").innerHTML      = evaluationResult.violations;
  document.getElementById("group_warnings").innerHTML        = evaluationResult.warnings;
  document.getElementById("group_manual_checks").innerHTML   = evaluationResult.manual_checks;
  document.getElementById("group_passed").innerHTML          = evaluationResult.passed;

  // Update Group Results

  var html = '';
  var node = document.getElementById("rule_results");

  for (let i = 0; i < evaluationResult.ruleResults.length; i++) {
    var rr = evaluationResult.ruleResults[i];0
    html += addRuleResultRow(rr.id, rr.label, rr.required, rr.violations, rr.warnings, rr.manual_checks, rr.passed, rr.hidden);
  }

  node.innerHTML = html;

}

