function CustomTool(options) {
  console.log('Entering Custom Tool Main');
  this.element = options.element;
  console.log('Custom Tool Element');
  console.log(this.element);
  this.document = options.element.ownerDocument;
  console.log('Custom Tool Document');
  console.log(this.document);
  this.onActiveChanged = options.onActiveChanged;
  console.log('Custom Tool onActiveChanged');
  console.log(this.onActiveChanged);
  this.activate = this.activate.bind(this);
  this.deactivate = this.deactivate.bind(this);
  this.toggle = this.toggle.bind(this);
}
CustomTool.prototype = {
  activate: function CustomTool_activate() {},
  deactivate: function CustomTool_deactivate() {},
  toggle: function CustomTool_toggle() {},
};
export { CustomTool, };
