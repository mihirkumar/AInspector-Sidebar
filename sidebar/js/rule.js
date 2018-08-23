"use strict";

function hideRulePanel() {
  hide('rule_panel');
}

function showRulePanel() {
  show('rule_panel');
}

function addGroupResultRow(id, label, v, w, mc, p) {
  var html = '<tr>'
  html += '  <th class="text"><a href="#" id="' + id + '">' + label + '</a></th>';
  html += '  <td class="num">' + v     + '</td>';
  html += '  <td class="num">' + w     + '</td>';
  html += '  <td class="num">' + mc    + '</td>';
  html += '  <td class="num">' + p     + '</td>';
  html += '</tr>'

  return html;
}

function clearSummaryPanel() {
  // update Rule Summary
  document.getElementById("summary_violations").innerHTML      = '-';
  document.getElementById("summary_warnings").innerHTML        = '-';
  document.getElementById("summary_manual_checks").innerHTML   = '-';
  document.getElementById("summary_passed").innerHTML          = '-';

  // Update Group Results

  var html = '';
  for (let i = 0; i < rcOptions.length; i++) {
    html += addGroupResultRow('', rcOptions[i].label, '-', '-', '-', '-');
  }
  document.getElementById("rc_results").innerHTML = html;

  html = '';
  for (let i = 0; i < glOptions.length; i++) {
    html += addGroupResultRow('', glOptions[i].label, '-', '-', '-', '-');
  }
  document.getElementById("gl_results").innerHTML = html;

}

function updateRulePanel(evaluationResult) {
  var html = '';
  var node = document.getElementById(element_results');

  for (let i = 0; i < groupResults.length; i++) {
    var gr = groupResults[i];
    html += addGroupResultRow(gr.id, gr.label, gr.violations, gr.warnings, gr.manual_checks, gr.passed);
  }

  html += addGroupResultRow(0x0FFF, 'All', evaluationResult.violations, evaluationResult.warnings, evaluationResult.manual_checks, evaluationResult.passed);
  node.innerHTML = html;

  var buttons = node.getElementsByTagName('a');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (event) {var id = group_id + '-' + event.currentTarget.id; handleGetGroup(id);});
  }
}
