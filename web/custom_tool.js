const states = {
    NO_ACTION: 1,
    SELECTING: 2,
    SELECTED: 3,
};
function CustomTool(options) {
  this.element = options.element;
  this.document = options.element.ownerDocument;
  this.activate = this.activate.bind(this);
  this.deactivate = this.deactivate.bind(this);
  this.toggle = this.toggle.bind(this);
  this._onmousedown = this._onmousedown.bind(this);
  this._onmousemove = this._onmousemove.bind(this);
  this._onmouseup = this._onmouseup.bind(this);
  this._addbindings = this._addbindings.bind(this);
  this._removebindings = this._removebindings.bind(this);
  this.createSelectionBox = this.createSelectionBox.bind(this);
  this.resizeSelectionBox = this.resizeSelectionBox.bind(this);
  this.destroySelectionBox = this.destroySelectionBox.bind(this);
  this.getBoundingBox = this.getBoundingBox.bind(this);
  this.getPages = this.getPages.bind(this);
}
CustomTool.prototype = {
    getPages: function CustomTool_getPages() {
        this.pages = this.element.querySelectorAll('.page');
    },
    activate: function CustomTool_activate() {
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
        if (this.state) {
            this.state = null;
            if (this.activeSelection) {
                this._removebindings();
                this.destroySelectionBox();
                this.activeSelection = false;
            }
            let _that = this;
            this.pages.forEach(function (elem) {
                elem.removeEventListener('mousedown', _that._onmousedown, true);
            });
        }
    },
    _onmousedown: function CustomTool_onmousedown(event) {
        switch (this.state) {
            case states.NO_ACTION:
                this.activeSelection = true;
                this.activePage = event.currentTarget;
                let rect = this.activePage.getBoundingClientRect();
                this.startX = event.clientX - rect.left;
                this.startY = event.clientY - rect.top;
                this.endX = this.startX;
                this.endY = this.startY;
                this._addbindings();
                this.createSelectionBox();
                this.state = states.SELECTING;
                break;
            case states.SELECTING:
                this._removebindings();
                this.destroySelectionBox();
                this.activeSelection = false;
                this.state = states.NO_ACTION;
                break;
            case states.SELECTED:
                if (this.activePage == event.currentTarget) {
                    alert(this.getBoundingBox());
                    this.destroySelectionBox();
                    this.activeSelection = false;
                    this.state = states.NO_ACTION;
                    break;
                } else {
                    this._removebindings();
                    this.destroySelectionBox();
                    this.activeSelection = false;
                    this.state = states.NO_ACTION;
                    break;
                }

        }
        event.preventDefault();
    },
    _onmousemove: function CustomTool_onmousemove(event) {
        switch (this.state) {
            case states.NO_ACTION:
                break;
            case states.SELECTING:
                let rect = this.activePage.getBoundingClientRect();
                this.endX = event.clientX - rect.left;
                this.endY = event.clientY - rect.top;
                this.resizeSelectionBox();
                break;
            case states.SELECTED:
                break;
        }
    },
    _onmouseup: function CustomTool_onmouseup(event) {
        switch (this.state) {
            case states.NO_ACTION:
                break;
            case states.SELECTING:
                this._removebindings();
                this.state = states.SELECTED;
                break;
            case states.SELECTED:
                this.destroySelectionBox();
                this.activeSelection = false;
                this.state = states.NO_ACTION;
                break;
        }
    },
    _addbindings: function CustomTool_addbindings() {
        this.activePage.addEventListener('mousemove',
        this._onmousemove, true);
        this.activePage.addEventListener('mouseup',
            this._onmouseup, true);
    },
    _removebindings: function CustomTool_removebindings() {
        this.activePage.removeEventListener('mousemove',
        this._onmousemove, true);
        this.activePage.removeEventListener('mouseup',
            this._onmouseup, true);
    },
    createSelectionBox: function CustomTool_createSelectionBox() {
        this.selectionBox = this.document.createElement('div');
        this.activePage.appendChild(this.selectionBox);
        this.selectionBox.className = 'custom-tool-selection';
        this.selectionBox.style.left = this.startX + 'px';
        this.selectionBox.style.top = this.startY + 'px';
        this.selectionBox.style.width = 0 + 'px';
        this.selectionBox.style.height = 0 + 'px';
    },
    resizeSelectionBox: function CustomTool_resizeSelectionBox() {
        let xMin = Math.min(this.startX, this.endX);
        let xMax = Math.max(this.startX, this.endX);
        let yMin = Math.min(this.startY, this.endY);
        let yMax = Math.max(this.startY, this.endY);
        this.selectionBox.style.left = xMin + 'px';
        this.selectionBox.style.top = yMin + 'px';
        this.selectionBox.style.width = xMax - xMin + 'px';
        this.selectionBox.style.height = yMax - yMin + 'px';

    },
    destroySelectionBox: function CustomTool_destroySelectionBox() {
        this.activePage.removeChild(this.selectionBox);
    },
    getBoundingBox: function CustomTool_getBoundingBox() {
        let pageWidth = parseInt(this.activePage.style.width);
        let pageHeight = parseInt(this.activePage.style.height);
        let bboxOutput = '';
        bboxOutput += 'BoundingBox(' + (this.startX / pageWidth).toFixed(4) + ', ';
        bboxOutput += (this.startY / pageHeight).toFixed(4) + ', ';
        bboxOutput += (this.endX / pageWidth).toFixed(4) + ', ';
        bboxOutput += (this.endY / pageHeight).toFixed(4) + ')';
        return bboxOutput;

    },
    toggle: function CustomTool_toggle() {
        if (this.state) {
            this.deactivate();
        } else {
            this.activate();
        }
    },
};
export { CustomTool, };
