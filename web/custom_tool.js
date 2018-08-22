const states = {
    NO_ACTION: 0,
    SELECTING: 1,
    SELECTED: 2,
};
function CustomTool(options) {
  console.log('Entering Custom Tool Main');
  this.element = options.element;
  console.log('Custom Tool Element');
  console.log(this.element);
  this.document = options.element.ownerDocument;
  console.log('Custom Tool Document');
  console.log(this.document);
  this.activate = this.activate.bind(this);
  this.deactivate = this.deactivate.bind(this);
  this.toggle = this.toggle.bind(this);
  this._onmousedown = this._onmousedown.bind(this);
  this._onmousemove = this._onmousemove.bind(this);
  this._onmouseup = this._onmouseup.bind(this);
}
CustomTool.prototype = {
    getPages: function CustomTool_getPages() {
        this.pages = this.element.querySelectorAll('.page');
        console.log('Custom Tool Pages');
        console.log(this.pages);
    },
    activate: function CustomTool_activate() {
        console.log('Custom Tool Activate');
        if (!this.state) {
            this.state = states.NO_ACTION;
            this.getPages();
            let _that = this;
            this.pages.forEach(function (elem) {
                elem.addEventListener('mousedown', _that._onmousedown, true);
            });
        }
    },
    deactivate: function CustomTool_deactivate() {
        console.log('Custom Tool Deactivate');
        if (this.state) {
            this.state = null;
            if (this.activeSelection) {
                this._removebindings();
                this.activeSelection = null;
            }
            let _that = this;
            this.pages.forEach(function (elem) {
                elem.removeEventListener('mousedown', _that._onmousedown, true);
            });
        }
    },
    _onmousedown: function CustomTool_onmousedown(event) {
        console.log('Custom Tool mousedown');
        switch (this.state) {
            case states.NO_ACTION:
                this.activeSelection = {};
                this.activeSelection.page = event.target;
                this.activeSelection.startX = event.offsetX;
                this.activeSelection.startY = event.offsetY;
                this.activeSelection.endX = this.activeSelection.startX;
                this.activeSelection.enY = this.activeSelection.startY;
                this._addbindings();
                this.state = states.SELECTING;
                break;
            case states.SELECTING:
                this._removebindings();
                this.activeSelection = null;
                this.state = states.NO_ACTION;
                break;
            case states.SELECTED:
                this.activeSelection = null;
                this.state = states.NO_ACTION;
                break;
        }
        console.log(this.activeSelection);
        event.preventDefault();
    },
    _onmousemove: function CustomTool_onmousemove(event) {
        console.log('Custom Tool mousemove');
        switch (this.state) {
            case states.NO_ACTION:
                break;
            case states.SELECTING:
                this.activeSelection.endX = event.offsetX;
                this.activeSelection.endY = event.offsetY;
                break;
            case states.SELECTED:
                break;
        }
        console.log(this.activeSelection);
    },
    _onmouseup: function CustomTool_onmouseup(event) {
        console.log('Custom Tool mouseup');
        switch (this.state) {
            case states.NO_ACTION:
                break;
            case states.SELECTING:
                this._removebindings();
                this.state = states.SELECTED;
                break;
            case states.SELECTED:
                this.activeSelection = null;
                this.state = states.NO_ACTION;
                break;
        }
        console.log(this.activeSelection);
    },
    _addbindings: function CustomTool_addbindings() {
        this.activeSelection.page.addEventListener('mousemove',
        this._onmousemove, true);
        this.document.addEventListener('mouseup',
            this._onmouseup, true);
    },
    _removebindings: function CustomTool_removebindings() {
        this.activeSelection.page.removeEventListener('mousemove',
        this._onmousemove, true);
        this.document.removeEventListener('mouseup',
            this._onmouseup, true);
    },
    toggle: function CustomTool_toggle() { },
};
export { CustomTool, };
