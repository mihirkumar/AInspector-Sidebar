"use strict";

function updateSummaryPanel(evaluationResult) {

  function addGroupResultRow(id, label, v, w, mc, p) {
    var html = '<tr>'
    html += '  <th><a href="#" id="' + id + '">' + label + '</a></th>';
    html += '  <td>' + v     + '</td>';
    html += '  <td>' + w     + '</td>';
    html += '  <td>' + mc    + '</td>';
    html += '  <td>' + p     + '</td>';
    html += '</tr>'

    return html;
  }

  // update Rule Summary
  document.getElementById("summary_violations").innerHTML      = evaluationResult.violations;
  document.getElementById("summary_warnings").innerHTML        = evaluationResult.warnings;
  document.getElementById("summary_manual_checks").innerHTML   = evaluationResult.manual_checks;
  document.getElementById("summary_passed").innerHTML          = evaluationResult.passed;

  // Update Group Results

  var html = '';
  var node = document.getElementById("group_results");


  for (let i = 0; i < evaluationResult.groupResults.length; i++) {
    var gr = evaluationResult.groupResults[i];

    html += addGroupResultRow(gr.id, gr.label, gr.violations, gr.warnings, gr.manual_checks, gr.passed);
  }

  html += addGroupResultRow('all', 'All', evaluationResult.violations, evaluationResult.warnings, evaluationResult.manual_checks, evaluationResult.passed);
  node.innerHTML = html;

  var buttons = node.getElementsByTagName('a');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', handleGroupButton);
  }
}

