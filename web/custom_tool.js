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
  this._addbindings = this._addbindings.bind(this);
  this._removebindings = this._removebindings.bind(this);
  this.createSelectionBox = this.createSelectionBox.bind(this);
  this.resizeSelectionBox = this.resizeSelectionBox.bind(this);
  this.destroySelectionBox = this.destroySelectionBox.bind(this);
  this.getBoundingBox = this.getBoundingBox.bind(this);
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
                this.destroySelectionBox();
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
                let rect = this.activeSelection.page.getBoundingClientRect();
                this.activeSelection.startX = event.pageX - rect.left;
                this.activeSelection.startY = event.pageY - rect.top;
                this.activeSelection.endX = this.activeSelection.startX;
                this.activeSelection.endY = this.activeSelection.startY;
                this._addbindings();
                this.createSelectionBox();
                this.state = states.SELECTING;
                break;
            case states.SELECTING:
                this._removebindings();
                this.destroySelectionBox();
                this.activeSelection = null;
                this.state = states.NO_ACTION;
                break;
            case states.SELECTED:
                alert(this.getBoundingBox());
                this.destroySelectionBox();
                this.activeSelection = null;
                this.state = states.NO_ACTION;
                break;
        }
        console.log(this.activeSelection);
        event.preventDefault();
    },
    _onmousemove: function CustomTool_onmousemove(event) {
        console.log('Custom Tool mousemove');
        console.log(event);
        switch (this.state) {
            case states.NO_ACTION:
                break;
            case states.SELECTING:
                let rect = this.activeSelection.page.getBoundingClientRect();
                this.activeSelection.endX = event.pageX - rect.left;
                this.activeSelection.endY = event.pageY - rect.top;
                this.resizeSelectionBox();
                break;
            case states.SELECTED:
                break;
        }
        // console.log(this.state);
        // console.log(this.activeSelection);
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
                this.destroySelectionBox();
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
    createSelectionBox: function CustomTool_createSelectionBox() {
        this.activeSelection.box = this.document.createElement('div');
        this.activeSelection.page.appendChild(this.activeSelection.box);
        this.activeSelection.box.className = 'custom-tool-selection';
        this.activeSelection.box.style.left = this.activeSelection.startX + 'px';
        this.activeSelection.box.style.top = this.activeSelection.startY + 'px';
        this.activeSelection.box.style.width = 0 + 'px';
        this.activeSelection.box.style.height = 0 + 'px';
    },
    resizeSelectionBox: function CustomTool_resizeSelectionBox() {
        let xMin = Math.min(this.activeSelection.startX, this.activeSelection.endX);
        let xMax = Math.max(this.activeSelection.startX, this.activeSelection.endX);
        let yMin = Math.min(this.activeSelection.startY, this.activeSelection.endY);
        let yMax = Math.max(this.activeSelection.startY, this.activeSelection.endY);
        console.log(xMin, xMax, yMin, yMax);
        this.activeSelection.box.style.left = xMin + 'px';
        this.activeSelection.box.style.top = yMin + 'px';
        this.activeSelection.box.style.width = xMax - xMin + 'px';
        this.activeSelection.box.style.height = yMax - yMin + 'px';

    },
    destroySelectionBox: function CustomTool_destroySelectionBox() {
        this.activeSelection.page.removeChild(this.activeSelection.box);
    },
    getBoundingBox: function CustomTool_getBoundingBox() {
        let pageWidth = parseInt(this.activeSelection.page.style.width);
        let pageHeight = parseInt(this.activeSelection.page.style.height);
        let bboxOutput = '';
        bboxOutput += 'BoundingBox(' + (this.activeSelection.startX / pageWidth).toFixed(4) + ', ';
        bboxOutput += (this.activeSelection.startY / pageHeight).toFixed(4) + ', ';
        bboxOutput += (this.activeSelection.endX / pageWidth).toFixed(4) + ', ';
        bboxOutput += (this.activeSelection.endY / pageHeight).toFixed(4) + ')';
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
