import methods from "./methods";

import applyPlugins from "./utils/apply-plugins";

class PhylocanvasGL {
  constructor(view = document.body, props, plugins = []) {
    const domElemment = (typeof view === "string") ? document.getElementById(view) : view;

    this.cache = new Map();

    this.view = domElemment;

    this.deferred = {
      count: 0,
      render: false,
    };

    this.layers = [];

    const size = props?.size || view.getBoundingClientRect();
    this.props = {
      ...props,
      size,
    };

    if (plugins.length) {
      applyPlugins(this, plugins);
    }

    this.init();

    if (props) {
      this.setProps(this.props);
    }

    return this;
  }
}

Object.assign(
  PhylocanvasGL.prototype,
  methods,
);

PhylocanvasGL.create = function (...args) {
  return new this(...args);
};

export default PhylocanvasGL;
