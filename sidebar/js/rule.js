"use strict";

function hideRulePanel() {
  hide('rule_panel');
}

function showRulePanel() {
  show('rule_panel');
}

function addElementResultRow(element, result, position, actionMessage) {

  var html = '<tr>'
  html += '  <th class="text"><a href="#" id="' + position + '">' + element + '</a></th>';
  html += '  <td class="' + result.toLowerCase() + '">' + result + '</td>';
  html += '  <td class="num">' + position + '</td>';
  html += '  <td class="text">' + actionMessage  + '</td>';
  html += '</tr>'

  return html;
}

function clearRulePanel() {


}

function updateDetailsAction(evaluationResult) {

  var da = evaluationResult.detailsAction;

  document.getElementById('da_definition').innerHTML = da.definition;

}

function updateRulePanel(evaluationResult) {

  updateDetailsAction(evaluationResult);

  var html = '';
  var node = document.getElementById('element_results');

  var elementResults = evaluationResult.elementResults;

  for (let i = 0; i < elementResults.length; i++) {
    var er = elementResults[i];
    html += addElementResultRow(er.element, er.result, er.position, er.actionMessage);
  }

  node.innerHTML = html;

  var buttons = node.getElementsByTagName('a');

  var ruleId = messageArgs.ruleId;

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (event) {var pos = parseInt(event.currentTarget.id); handleGetRule(ruleId, pos);});
  }
}
