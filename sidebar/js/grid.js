"use strict";
/*
*   File:   Grid.js
*
*   Desc:   Grid widget for AInspector Sidebar
*
*   Author(s): Jon Gunderson
*/

var Grid = function (domNode, allowHeaderNavigation) {

  if (typeof allowHeaderNavigation !== 'boolean') {
    allowHeaderNavigation = false;
  }

  this.domNode = domNode;

  this.theadNode = null;
  this.tbodyNode = null;

  this.allowHeaderNavigation = allowHeaderNavigation;
  this.cellNavigation = true;

  this.currentId = '';
  this.currentIndex = 0;

  this.rows = [];

  this.firstRow = false;
  this.lastRow = false;

};

Grid.prototype.init = function () {
  this.domNode.tabIndex = -1;

  var theadNode = this.domNode.querySelector('thead');

  if (theadNode) {
    this.theadNode = theadNode;

    var trNode = theadNode.querySelector('tr');

    if (trNode) {
      var gridRow = new GridRow(trNode, this, '', false, true);
      gridRow.init();

//      alert('[gridRow]: ' + gridRow);

      var thNodes = trNode.querySelectorAll('th');

//      alert('[thNodes]: ' + thNodes);

      for(let i = 0; i < thNodes.length; i++) {
        var gridCell = new GridCell(thNodes[i], true);
//        alert('[gridCell]: ' + gridCell);
        gridRow.addGridCell(gridCell);
      }

      this.rows.push(gridRow);
    }

  }
  else {
    this.theadNode = document.createElement('thead');
    this.domNode.appendChild(this.theadNode);
  }

  var tbodyNode = this.domNode.querySelector('tbody');

  if (tbodyNode) {
    this.tbodyNode = tbodyNode;
  }
  else {
    this.tbodyNode = document.createElement('tbody');
    this.domNode.appendChild(this.tbodyNode);
  }

//  alert('[gridRow.cells]: ' + gridRow.cells.length);

};

Grid.prototype.addRow = function (id, action, thead) {

  if (typeof action !== 'function') {
    action = false;
  }

  if (typeof thead !== 'boolean') {
    thead = false;
  }

  var node = document.createElement('tr');
  node.id = id;

  var gridRow = new GridRow(node, this, id, action, thead);
  gridRow.init();

//  alert(thead + '\n' + this.tbodyNode + '\n' + this.theadNode);

  if (thead) {
    this.theadNode.appendChild(node);
    this.rows.unshift(gridRow);
  }
  else {
    this.tbodyNode.appendChild(node);
    this.rows.push(gridRow);
  }

  for (let i = 0; i < this.rows.length; i++) {
    var row = this.rows[i];
    row.index = i;
    if (!this.firstRow &&
        ((row.isThead && this.allowHeaderNavigation) ||
          !row.isThead)) {
      this.firstRow = row;
    }
    this.lastRow = row;
  }

  return gridRow;
};

Grid.prototype.clearRows = function (header) {

  if (typeof header !== 'boolean') {
    header = false;
  }

  for (let i = (this.rows.length - 1); i > 0; i--) {
    var row = this.rows[i];
    if (!row.isThead || header) {
      row.remove();
      this.rows.pop()
    }
  }
};

Grid.prototype.setCurrentId = function (id) {
  this.currentId = id;
}

Grid.prototype.resetCurrentId = function () {
  this.currentId = '';
}

Grid.prototype.getCurrentId = function () {
  return this.currentId;
}

Grid.prototype.setFocusToRowById = function (id) {

  var flag = true;

  for(let i = 0; i < this.rows.length; i++) {
    var row = this.rows[i];
    row.removeFocus();
    if (row.id === id) {
      row.setFocus();
      flag = false;
    }
  }

  if (flag) {
    this.firstRow.setFocus();
  }

}

Grid.prototype.setFocusToRow = function (index) {

  for(let i = 0; i < this.rows.length; i++) {
    this.row[i].removeFocus();
  }

  if (this.row[i]) {
    this.row[i].setFocus();
  }
  else {
    this.firstRow.setFocus();
  }

}

Grid.prototype.moveFocusToPreviousRow = function () {
  if (this.currentIndex  > 1) {
    if ((this.rows(this.currentIndex-1).isThead && this.allowHeaderNavigation) ||
      !this.rows(this.currentIndex-1).isThead) {
      this.currentIndex += -1;
      this.rows(this.currentIndex).setFocus();
    }
  }
};

Grid.prototype.moveFocusToNextRow = function () {
  this.currentIndex + 1;
  if (this.currentIndex >= this.rows.length) {
    this.currentIndex = this.rows.length-1;
  }
  this.rows(this.currentIndex).setFocus();
};

Grid.prototype.moveFocusToFirstCell = function () {
};

// =======================
//
// GridRow
//
// =======================


var GridRow = function (domNode, grid, id, action, thead) {

  if (typeof action !== 'function') {
    action = false;
  }

  if (typeof thead !== 'boolean') {
    thead = false;
  }


  this.domNode = domNode;
  this.grid    = grid;
  this.id      = id;
  this.action  = action;
  this.index = -1;

  this.isThead = thead;

  this.cells = [];

  this.keyCode = Object.freeze({
    'RETURN': 13,
    'SPACE': 32,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

GridRow.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

GridRow.prototype.addCell = function (content, type, sort, header) {

  if (typeof sort !== 'number' && typeof sort !== 'string') {
    sort = false;
  }

  if (typeof header !== 'boolean') {
    header = false;
  }

  var node;

  if (this.isThead || header) {
    node = document.createElement('th');
  }
  else {
    node = document.createElement('td');
  }

  node.innerHTML = content;
  this.domNode.appendChild(node);
  node.className = type;
  if (sort) {
    node.setAttribute('data-sort', sort);
  }


  var gridCell = new GridCell(node, this, header);

  gridCell.init();
  this.cells.push(gridCell);

};

GridRow.prototype.addGridCell = function (gridCell) {
  this.cells.push(gridCell);
};

GridRow.prototype.remove = function () {
  this.domNode.remove();
};

GridRow.prototype.removeFocus = function () {
  this.domNode.tabIndex = -1;
};

GridRow.prototype.setFocus = function () {
  this.domNode.focus();
  this.domNode.tabIndex = 0;
  this.grid.currentIndex = this.index;
};


/* EVENT HANDLERS */

GridRow.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      if (this.action) {
        this.action("activate", this.id);
      }
      flag = true;
      break;

    case this.keyCode.UP:
      flag = true;
      break;

    case this.keyCode.DOWN:
      flag = true;
      break;

    case this.keyCode.RIGHT:
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

GridRow.prototype.handleClick = function (event) {
  if (this.action) {
    this.action("click", this.id);
  }
};

GridRow.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.grid.setCurrentId(this.id);
  if (this.action) {
    this.action("focus", this.id);
  }
};

GridRow.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.grid.resetCurrentId();
  if (this.action) {
    this.action("blur", this.id);
  }
};

// =======================
//
// GridCell
//
// =======================

var GridCell = function (domNode, gridRow, header) {

  if (typeof header !== 'boolean' ) {
    header = false;
  }

  this.domNode = domNode;
  this.gridRow = gridRow;

  this.isHeader = header;


  this.keyCode = Object.freeze({
    'RETURN': 13,
    'SPACE': 32,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};


GridCell.prototype.init = function () {
//  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};



/* EVENT HANDLERS */

GridCell.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.UP:
      flag = true;
      break;
    case this.keyCode.DOWN:
      flag = true;
      break;
    case this.keyCode.LEFT:
      flag = true;
      break;
    case this.keyCode.RIGHT:
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

GridCell.prototype.handleClick = function (event) {

};

GridCell.prototype.handleFocus = function (event) {

};

GridCell.prototype.handleBlur = function (event) {

};


var grids = document.querySelectorAll('.grid');


var rcGrid = new Grid(grids[0]);
rcGrid.init();

var glGrid = new Grid(grids[1]);
glGrid.init();

// alert(rcGrid + '\n' + glGrid);
