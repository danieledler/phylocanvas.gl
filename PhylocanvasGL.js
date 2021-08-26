/* eslint-disable no-plusplus */
/* eslint-disable prefer-rest-params */
import { Deck, OrthographicView } from "@deck.gl/core";

import { TreeTypes } from "./constants";
import defaults from "./defaults";
import methods from "./methods";

import applyPlugins from "./utils/apply-plugins";
import createController from "./utils/create-controller";
import hasInteraction from "./utils/has-interaction";
import targetToCentre from "./utils/target-to-centre";

import renderBranchLabels from "./layers/branch-labels";
import renderEdges from "./layers/edges";
import renderHighlight from "./layers/highlight";
import renderInternalLabels from "./layers/internal-labels";
import renderLeafLabels from "./layers/leaf-labels";
import renderMetadata from "./layers/metadata";
import renderPiecharts from "./layers/piecharts";
import renderSelection from "./layers/selection";
import renderShapes from "./layers/shapes";

const logoDataUrl = "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAUCAYAAADFlsDIAAAABHNCSVQICAgIfAhkiAAABJpJREFUWIXtl0FvGkcUx/9vZqHKITKJ1PZoeuwppFJlBVx5/QlCjz2VfAIwJPIlsLsmFyuBXY49BX+C4nMuIAWIT3XUa6VuDjm0h4Y2lZrCzHs9EBxMnNSochSl/p1mdt+8efOfeW92gXPOOQto2QHr5Z08E90nYATA7zeqe2cQ13uJWnYAE4UEpACkBYjOIKb3lqXFIpGPj9pT0f43LCVW9tbuRRZ8J5BfRDAC0dbb7HOVunsav6e1e5fkKnV3o+gdOwzOMg60mXwuoAdgPGAn2e/f3X4+e5ct7xQIekVgfwdJJmHYHzO7ALr/5pdPafcuEZH0CyDGtDYDWBBro+ilJloXQXLJOhwd7AYxMD1RU6HkMgBYUvFwTqgZxo73D1pBvFb00tA6DxFkyzsFAVY4YfcPdoM4V6m7/Ua1C0x3b9YGpoIDABFJv1HdW9v20mqsCgAwDD3/WnmnCJFLSqmf+43qXq5Sd0kkZUUymuhQW9u1WrsPm7XO2raXTkx0BgCsSAYAOMntg90gnvPTnc0/Pxdp3QHzawIeS8OJ1hER+QRVdIx+9FUpuL6+FWwoM87NhJqqPv71bbviOEhDqWcAYK3tDpu11iyQl6cIi+3szTsZIpJBs9YWEVoremk90b5SCkqpLgAoosdKqa6QFL4sehlmdpnoW6VUV0BhrxWMBBQCAI1VXohW2KpYKdXVSqW0UaX18k6eiFylVNcYE8/m12NVGoaePww9H2ILJ63reM0i2pjrfMqOXgHUhdeH/fHXSc60o0rXtgJfoPKDe7f3AeCgFcQn2S5CMkkBeDINw8aO46ShsGqMac92n0WuMLNLjFTScab1RGS/36h25eVHEAv3cpW6qzRdN8b0CJMUM7sskiJWK0I0IiAj4HxCT08eAMhcugm/as9zTCxiah11RJ5ayz8YmJ8MzG/H7NTlT05yZg1Hw9DzBw2vdBqBliF7804GwOYw9HwWefwmO03UEXAe/HKjHB0mmSMi2waAfqPadYy5SlAdBoobRS+1tu2lTxPDsZrVD29H6+WdmIFUwtpOvxUcKZy9tXtRmRdfAOqCZk5veN7TXhCYZRdNQCpX8VwWfQUirwIxOBwrLuUqHoRVPsHGHzuqp7W+n6vUY6MngSPOlWwliCC0+ib/2touO07Iwi0AEMLIOE4oJGkC4mzRy0wcVYBIiojiv5UqqAm5ROhc2wp8ED1TRKsiEi/6fu3T4WGz1hk0a+3enFAAMLi7/dyAf5yumL6Z/Onsze9IwtrOYsolmaPF9iD0SsYgTlq7N/+u1wpGSebIGMQJZr/XCkbDhudba28YY4KD3SB2jLlqDUcJa792jDlMMkcJazsAYI3ZBIBeKxhZYzY/Ym4DwOBebVMMtQb3apsOm61BKzi0hiNYFfUb1RuPQi9KWlsYNGvtJHOUtHaPmZ8MmrX24nqW/t3JlndCIioB0zxPGPPZorBvI1epuyKSBknGGo5OW9POmmzxTkaUzQMAse4MWrcPF22WF6tS/56A/Nyjzfnr/0Nm+d8dpt5RRxDPX78fOkufLOBVKiWs7SyTguecc845/5F/ABRBaZJ181VHAAAAAElFTkSuQmCC\")";

function init(tree) {
  let timeoutId;

  const resetFixedScale = () => tree.setProps({ fixedScale: null });

  tree.deck = new Deck({
    pickingRadius: 2,
    useDevicePixels: false,
    views: new OrthographicView({
      controller: (hasInteraction(tree, "pan") || hasInteraction(tree, "zoom")) ? createController(tree) : false,
    }),
    initialViewState: { target: [0, 0, 0], zoom: 0 },
    layers: [],
    onViewStateChange: ({ viewState }) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        resetFixedScale,
        500,
      );
      tree.setView({
        centre: targetToCentre(tree, viewState.target),
        zoom: viewState.zoom,
        fixedScale: tree.props.fixedScale ?? tree.getScale(),
      });
    },
    onHover: (info, event) => tree.handleHover(info, event),
    onClick: (info, event) => tree.handleClick(info, event),
  });

  tree.view.appendChild(tree.deck.canvas);

  tree.view.style.position = "relative";
  tree.view.style.backgroundImage = logoDataUrl;
  tree.view.style.backgroundRepeat = "no-repeat";
  tree.view.style.backgroundPosition = "right bottom";

  tree.addLayer(
    "edges",
    (props) => (props.showEdges ?? defaults.showEdges),
    renderEdges,
  );

  tree.addLayer(
    "leaf-labels",
    (props) => props.showLabels && props.showLeafLabels,
    renderLeafLabels,
  );

  tree.addLayer(
    "shapes",
    (props) => (props.showShapes ?? defaults.showShapes),
    renderShapes,
  );

  tree.addLayer(
    "internal-labels",
    (props) => props.showLabels && props.showInternalLabels,
    renderInternalLabels,
  );

  tree.addLayer(
    "branch-labels",
    (props) => props.showLabels && props.showBranchLengths,
    renderBranchLabels,
  );

  tree.addLayer(
    "piecharts",
    (props) => props.showPiecharts !== false && props.collapsedIds && props.collapsedIds.length,
    renderPiecharts,
  );

  tree.addLayer(
    "metadata",
    (props) => props.type !== TreeTypes.Radial && props.metadata && props.blocks && props.blocks.length,
    renderMetadata,
  );

  tree.addLayer(
    "selection",
    (props) => props.selectedIds && props.selectedIds.length,
    renderSelection,
  );

  tree.addLayer(
    "highlights",
    true,
    renderHighlight,
  );
}

class PhylocanvasGL {
  constructor(view = document.body, props, plugins = []) {
    const domElemment = (typeof view === "string") ? document.getElementById(view) : view;

    this.cache = new Map();
    this.cache2 = new Map();
    this.cache3 = new Map();

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

    init(this);

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
