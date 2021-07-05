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

import { TreeTypes } from "../../constants";

import memoise from "../../utils/memoise";

import treeTypeSelector from "../../selectors/treeType";

import graphSelector from "../../selectors/graph";

const arcsDataSelector = memoise(
  graphSelector,
  treeTypeSelector,
  (
    { nodes },
    treeType,
  ) => {
    const arcs = [];

    if (treeType === TreeTypes.Circular) {
      arcs.centrePoint = [ nodes.root.x, nodes.root.y ];

      for (let i = nodes.firstIndex + 1; i < nodes.lastIndex; i++) {
        const node = nodes.preorderTraversal[i];

        if (node.children && node.children.length && !node.isCollapsed) {
          const firstChild = node.children[0];
          const lastChild = node.children[node.children.length - 1];
          arcs.push({
            startAngle: firstChild.angle,
            endAngle: lastChild.angle,
            radius: node.dist,
            node,
          });
        }

        // skip collapsed sub-trees
        if (node.isCollapsed) {
          i += node.totalNodes - 1;
        }
      }
    }

    return arcs;
  }
);
arcsDataSelector.displayName = "arcs-data";

export default arcsDataSelector;
