"use strict";

var rcOptions = [];
rcOptions.push({ 'id': 0x0001, 'label': 'Landmarks'});
rcOptions.push({ 'id': 0x0002, 'label': 'Headings'});
rcOptions.push({ 'id': 0x0004, 'label': 'Styles/Content'});
rcOptions.push({ 'id': 0x0008, 'label': 'Images'});
rcOptions.push({ 'id': 0x0010, 'label': 'Links'});
rcOptions.push({ 'id': 0x0020, 'label': 'Tables'});
rcOptions.push({ 'id': 0x0040, 'label': 'Forms'});
rcOptions.push({ 'id': 0x0080, 'label': 'Widgets/Scripts'});
rcOptions.push({ 'id': 0x0100, 'label': 'Audio/Video'});
rcOptions.push({ 'id': 0x0200, 'label': 'Keyboard'});
rcOptions.push({ 'id': 0x0400, 'label': 'Timing'});
rcOptions.push({ 'id': 0x0800, 'label': 'Site Navigation'});
rcOptions.push({ 'id': 0x0FFF, 'label': 'All'});

var glOptions = [];
glOptions.push({ 'id': 0x000010, 'label': 'Text Alternatives'});
glOptions.push({ 'id': 0x000020, 'label': 'Time-based Media'});
glOptions.push({ 'id': 0x000040, 'label': 'Adaptable'});
glOptions.push({ 'id': 0x000080, 'label': 'Distinguishable'});
glOptions.push({ 'id': 0x000100, 'label': 'Keyboard Accessible'});
glOptions.push({ 'id': 0x000200, 'label': 'Enough Time'});
glOptions.push({ 'id': 0x000400, 'label': 'Seizures'});
glOptions.push({ 'id': 0x000800, 'label': 'Navigable'});
glOptions.push({ 'id': 0x001000, 'label': 'Readable'});
glOptions.push({ 'id': 0x002000, 'label': 'Predictable'});
glOptions.push({ 'id': 0x004000, 'label': 'Input Assistance'});
glOptions.push({ 'id': 0x010000, 'label': 'Compatible'});
glOptions.push({ 'id': 0x01FFF0, 'label': 'All'});

function hideSummaryPanel() {
  hide('summary_panel');
}

function showSummaryPanel() {
  show('summary_panel');
}

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

function updateSummaryPanel(evaluationResult) {

  // update Rule Summary
  document.getElementById("summary_violations").innerHTML      = evaluationResult.violations;
  document.getElementById("summary_warnings").innerHTML        = evaluationResult.warnings;
  document.getElementById("summary_manual_checks").innerHTML   = evaluationResult.manual_checks;
  document.getElementById("summary_passed").innerHTML          = evaluationResult.passed;

  // Update Group Results

  function updateGroupResults(id, groupResults) {
    var html = '';
    var node = document.getElementById(id);

    for (let i = 0; i < groupResults.length; i++) {
      var gr = groupResults[i];

      html += addGroupResultRow(gr.id, gr.label, gr.violations, gr.warnings, gr.manual_checks, gr.passed);
    }

    html += addGroupResultRow(0x0FFF, 'All', evaluationResult.violations, evaluationResult.warnings, evaluationResult.manual_checks, evaluationResult.passed);
    node.innerHTML = html;

    var buttons = node.getElementsByTagName('a');

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (event) {var id = 'rc-' + event.currentTarget.id; handleGetGroup(id);});
    }
  }

  updateGroupResults('rc_results', evaluationResult.groupResults);
}

function updateViewMenu() {
  viewMenu.removeAllOptions();

  for (let i = 0; i < (rcOptions.length-1); i++) {
    viewMenu.addOption(rcOptions[i].id, 'menuitem', rcOptions[i].label, function() {var id = 'rc-' + rcOptions[i].id; handleGetGroup(id);});
  }

  viewMenu.addOption('', 'separator', '-------------');

  for (let i = 0; i < (glOptions.length-1); i++) {
    viewMenu.addOption(glOptions[i].id, 'menuitem', glOptions[i].label, function() {var id = 'gl-' + glOptions[i].id; handleGetGroup(id);});
  }

  viewMenu.addOption('', 'separator', '-------------');

  viewMenu.addOption(1, 'menuitem', 'All', function() {var mes = glOptions[i].id; alert(mes);});

}


