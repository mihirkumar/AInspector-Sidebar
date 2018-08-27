"use strict";

function hideRulePanel() {
  hide('rule_panel');
}

function showRulePanel() {
  show('rule_panel');
}

function addElementResultRow(element, result, position, actionMessage) {

  var e = element;
  if (element.length > 25) {
    e = element.substring(0, 23) + '... ';
  }

  var html = '<tr>'
  if (e === element) {
    html += '  <th class="text element"><a href="#" id="' + position + '">' + e + '</a></th>';
  }
  else {
    html += '  <th class="text element"><a href="#" id="' + position + '" title="' + element + '">' + e + '</a></th>';
  }
  html += '  <td class="value result ' + result.toLowerCase() + '">' + result + '</td>';
  html += '  <td class="num position">' + position + '</td>';
  html += '  <td class="text action">' + actionMessage  + '</td>';
  html += '</tr>'

  return html;
}

function clearRulePanel() {

  var html = '';
  var cells = document.querySelectorAll('tbody#element_results tr > *');

  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = '-';
  }
}

function updateDetailsAction(id, detailsAction) {

  function getDetails(items) {

    if (typeof items === 'string') {
      return items;
    }

    if (items.length === 1) {
      if(typeof items[0]  === 'string') {
        return items[0];
      }
      else {
        return items[0].title;
      }
    }

    var html = '<ul class="details">';
    for (let i=0; i < items.length; i++) {
      var item = items[i];
      if (typeof item === 'string') {
        html += '<li>' + items[i] + '</li>';
      }
      else {
        html += '<li><a href="' + items[i].url +'">' + items[i].title + '</li>';
      }
    }
    html += '</ul>';

    return html;

  }


  document.getElementById(id + '_definition').innerHTML      = getDetails(detailsAction.definition);
  document.getElementById(id + '_action').innerHTML          = getDetails(detailsAction.action);
  document.getElementById(id + '_purpose').innerHTML         = getDetails(detailsAction.purpose);
  document.getElementById(id + '_techniques').innerHTML      = getDetails(detailsAction.techniques);
  document.getElementById(id + '_target_elements').innerHTML = getDetails(detailsAction.targetElements);
  document.getElementById(id + '_compliance').innerHTML      = getDetails(detailsAction.compliance);
  document.getElementById(id + '_wcag').innerHTML            = getDetails(detailsAction.wcagPrimary);
  document.getElementById(id + '_information').innerHTML     = getDetails(detailsAction.informationalLinks);

}

function updateRulePanel(evaluationResult) {

  updateDetailsAction('da', evaluationResult.detailsAction);

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
