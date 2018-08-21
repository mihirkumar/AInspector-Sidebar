/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   MenuItem.js
*
*   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
*/

/*
*   @constructor MenuItem
*
*   @desc
*       Wrapper object for a simple menu item in a popup menu
*
*   @param domNode
*       The DOM element node that serves as the menu item container.
*       The menuObj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*   @param menuObj
*       The object that is a wrapper for the PopupMenu DOM element that
*       contains the menu item DOM element. See PopupMenuAction.js
*/
var MenuItem = function (domNode, popupMenuObj, menuAction) {

  this.domNode    = domNode;
  this.popupMenu  = popupMenuObj;

  if (typeof menuAction === 'function') {
    this.menuAction = menuAction;
  }
  else {
    this.menuAction = function () {};
  }

  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

MenuItem.prototype.init = function () {
  this.domNode.tabIndex = -1;

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'menuitem');
  }

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this));
  this.domNode.addEventListener('click',      this.handleClick.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this));

};

/* EVENT HANDLERS */

MenuItem.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (event.ctrlKey || event.altKey  || event.metaKey) {
    return;
  }

  if (event.shiftKey) {
    if (isPrintableCharacter(char)) {
      this.popupMenu.setFocusByFirstCharacter(this, char);
    }
  }
  else {

    switch (event.keyCode) {
      case this.keyCode.SPACE:
        flag = true;
        break;

      case this.keyCode.RETURN:
        this.handleClick(event);
        flag = true;
        break;

      case this.keyCode.ESC:
        this.popupMenu.setFocusToController();
        this.popupMenu.close(true);
        flag = true;
        break;

      case this.keyCode.UP:
        this.popupMenu.setFocusToPreviousItem(this);
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.popupMenu.setFocusToNextItem(this);
        flag = true;
        break;

      case this.keyCode.HOME:
      case this.keyCode.PAGEUP:
        this.popupMenu.setFocusToFirstItem();
        flag = true;
        break;

      case this.keyCode.END:
      case this.keyCode.PAGEDOWN:
        this.popupMenu.setFocusToLastItem();
        flag = true;
        break;

      case this.keyCode.TAB:
        this.popupMenu.setFocusToController();
        this.popupMenu.close(true);
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.popupMenu.setFocusByFirstCharacter(this, char);
        }
        break;
    }
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItem.prototype.handleClick = function (event) {
  if (this.menuAction) {
    this.menuAction(event);
  }
  this.popupMenu.setFocusToController();
  this.popupMenu.close(true);
};

MenuItem.prototype.handleFocus = function (event) {
  this.popupMenu.hasFocus = true;
};

MenuItem.prototype.handleBlur = function (event) {
  this.popupMenu.hasFocus = false;
  setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};

MenuItem.prototype.handleMouseover = function (event) {
  this.popupMenu.hasHover = true;
  this.popupMenu.open();

};

MenuItem.prototype.handleMouseout = function (event) {
  this.popupMenu.hasHover = false;
  setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};
