function CustomTool(options) {
  console.log('Entering Custom Tool Main');
  this.element = options.element;
  console.log('Custom Tool Element');
  console.log(this.element);
  this.activate = this.activate.bind(this);
  this.deactivate = this.deactivate.bind(this);
  this.toggle = this.toggle.bind(this);
}
CustomTool.prototype = {
  activate: function CustomTool_activate() {
    console.log('CustomTool Activate');
  },
  deactivate: function CustomTool_deactivate() {
    console.log('CustomTool Deactivate');
  },
  toggle: function CustomTool_toggle() {},
};
export { CustomTool, };
