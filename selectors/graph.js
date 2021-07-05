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

import { TreeTypes } from "../constants";

import memoise from "../utils/memoise";

import baseLayoutSelector from "./baseLayout";
import branchScaleSelector from "./branch-scale";
import stepScaleSelector from "./step-scale";
import treeTypeSelector from "./treeType";

function scaleBounds(bounds, branchScale, stepScale) {
  return {
    min: [
      bounds.min[0] * branchScale,
      bounds.min[1] * stepScale,
    ],
    max: [
      bounds.max[0] * branchScale,
      bounds.max[1] * stepScale,
    ],
  };
}

export default memoise(
  baseLayoutSelector,
  treeTypeSelector,
  branchScaleSelector,
  stepScaleSelector,
  (baseLayout, type, branchScale, stepScale) => {
    const { nodes, bounds } = baseLayout;
    const firstIndex = nodes.root.postIndex - nodes.root.totalNodes + 1;
    const lastIndex = nodes.root.postIndex;

    if (type === TreeTypes.Circular) {
      nodes.root.x = nodes.root.bx * branchScale;
      nodes.root.y = nodes.root.by * branchScale;
      for (let i = 0; i < nodes.root.totalNodes; i++) {
        const node = nodes.preorderTraversal[nodes.root.preIndex + i];
        node.x = node.bx * branchScale;
        node.y = node.by * branchScale;
        node.dist = node.distanceFromRoot * branchScale;
        node.cx = node.bcx * branchScale;
        node.cy = node.bcy * branchScale;
      }
      return {
        nodes,
        bounds: scaleBounds(
          bounds,
          branchScale,
          branchScale,
        ),
      };
    }

    if (type === TreeTypes.Diagonal) {
      nodes.root.x = nodes.root.bx * stepScale;
      nodes.root.y = nodes.root.by * stepScale;
      for (let i = 1; i < nodes.root.totalNodes; i++) {
        const node = nodes.preorderTraversal[nodes.root.preIndex + i];
        node.x = node.bx * stepScale;
        node.y = node.by * stepScale;
      }
      return {
        nodes,
        bounds: scaleBounds(
          bounds,
          branchScale,
          stepScale,
        ),
      };
    }

    if (type === TreeTypes.Hierarchical) {
      for (let i = firstIndex; i <= lastIndex; i++) {
        const node = nodes.postorderTraversal[i];
        node.x = node.bx * stepScale;
        node.y = node.by * branchScale;
      }
      return {
        nodes,
        bounds: scaleBounds(
          bounds,
          branchScale,
          stepScale,
        ),
      };
    }

    if (type === TreeTypes.Radial) {
      nodes.root.x = nodes.root.bx * branchScale;
      nodes.root.y = nodes.root.by * branchScale;
      for (let i = 1; i < nodes.root.totalNodes; i++) {
        const node = nodes.preorderTraversal[nodes.root.preIndex + i];
        node.x = node.bx * branchScale;
        node.y = node.by * branchScale;
      }
      return {
        nodes,
        bounds: scaleBounds(
          bounds,
          branchScale,
          branchScale,
        ),
      };
    }

    if (type === TreeTypes.Rectangular) {
      for (let i = firstIndex; i <= lastIndex; i++) {
        const node = nodes.postorderTraversal[i];
        node.x = node.bx * branchScale;
        node.y = node.by * stepScale;
      }

      return {
        nodes,
        bounds: scaleBounds(
          bounds,
          branchScale,
          stepScale,
        ),
      };
    }

    throw new Error("Invalid tree type");
  }
);
