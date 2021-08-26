// Phylocanvas.gl (https://phylocanvas.gl)
// Centre for Genomic Pathogen Surveillance.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { LineLayer } from "@deck.gl/layers";
import { CompositeLayer } from "@deck.gl/core";

import CircularCurveLayer from "../circular-curve-layer";
import { TreeTypes } from "../../../constants";

const EMPTY_ARRAY = Object.freeze([]);

export default class EdgesLayer extends CompositeLayer {

  updateState({ props, changeFlags }) {
    if (changeFlags.dataChanged) {
      const updater = {};

      updater.nodes = [];
      for (let i = props.data.firstIndex + 1; i < props.data.lastIndex; i++) {
        const node = props.data.preorderTraversal[i];
        updater.nodes.push(node);

        // skip collapsed sub-trees
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }

      if (this.props.treeType === TreeTypes.Circular && changeFlags.dataChanged) {
        // data to pass to the sublayer
        updater.nodesWithChldren = [];

        for (const node of updater.nodes) {
          if (node.children && node.children.length) {
            updater.nodesWithChldren.push(node);
          }
        }
      }

      this.setState(updater);
    }
  }

  renderLayers() {
    const { nodes } = this.state;

    const layers = [];

    if (this.props.treeType === TreeTypes.Rectangular) {
      layers.push(
        new LineLayer({
          data: nodes,
          getColor: this.props.getColor,
          getWidth: this.props.lineWidth,
          id: "edges-vertical-lines",
          pickable: true,
          updateTriggers: { getColor: this.props.getColor },
          getSourcePosition: (node) => [ node.parent.x, node.y ],
          getTargetPosition: (node) => [ node.x, node.y ],
        }),
      );
      layers.push(
        new LineLayer({
          data: nodes,
          getColor: this.props.getColor,
          getWidth: this.props.lineWidth,
          id: "edges-horizontal-lines",
          pickable: true,
          updateTriggers: { getColor: this.props.getColor },
          getSourcePosition: (node) => [ node.parent.x, node.parent.y ],
          getTargetPosition: (node) => [ node.parent.x, node.y ],
        }),
      );
    }

    else if (this.props.treeType === TreeTypes.Hierarchical) {
      layers.push(
        new LineLayer({
          data: nodes,
          getColor: this.props.getColor,
          getWidth: this.props.lineWidth,
          id: "edges-vertical-lines",
          pickable: true,
          updateTriggers: { getColor: this.props.getColor },
          getSourcePosition: (node) => [ node.x, node.parent.y ],
          getTargetPosition: (node) => [ node.x, node.y ],
        }),
      );
      layers.push(
        new LineLayer({
          data: nodes,
          getColor: this.props.getColor,
          getWidth: this.props.lineWidth,
          id: "edges-horizontal-lines",
          pickable: true,
          updateTriggers: { getColor: this.props.getColor },
          getSourcePosition: (node) => [ node.parent.x, node.parent.y ],
          getTargetPosition: (node) => [ node.x, node.parent.y ],
        }),
      );
    }

    else if (this.props.treeType === TreeTypes.Diagonal || this.props.treeType === TreeTypes.Radial) {
      layers.push(
        new LineLayer({
          data: nodes,
          getColor: this.props.getColor,
          getWidth: this.props.lineWidth,
          id: "edges-parent-lines",
          pickable: true,
          updateTriggers: { getColor: this.props.getColor },
          getSourcePosition: (node) => [ node.parent.x, node.parent.y ],
          getTargetPosition: (node) => [ node.x, node.y ],
        }),
      );
    }

    else if (this.props.treeType === TreeTypes.Circular) {
      const { nodesWithChldren } = this.state;
      layers.push(
        new LineLayer({
          data: nodes,
          getColor: this.props.getColor,
          getWidth: this.props.lineWidth,
          id: "edges-central-lines",
          pickable: true,
          updateTriggers: { getColor: this.props.getColor },
          getSourcePosition: (node) => [ node.x, node.y ],
          getTargetPosition: (node) => [ node.cx, node.cy ],
        }),
      );
      layers.push(
        new CircularCurveLayer({
          data: nodesWithChldren,
          getColor: this.props.getColor,
          id: "edges-arcs",
          pickable: true,
          strokeWidth: this.props.lineWidth,
          updateTriggers: { getColor: this.props.getColor },
          getCentrePoint: [ this.props.data.root.x, this.props.data.root.y ],
          getEndAngle: (x) => x.children[x.children.length - 1].angle,
          getStartAngle: (x) => x.children[0].angle,
          getRadius: (x) => x.dist,
        }),
      );
    }

    return layers;
  }

}

EdgesLayer.defaultProps = {
  data: {type: 'data', value: EMPTY_ARRAY, async: true},

  // Shared accessors
  getColor: { type: "accessor", value: (x) => x.fillColour },

  // lines accessors
  lineWidth: 1,
};

EdgesLayer.componentName = "EdgesLayer";