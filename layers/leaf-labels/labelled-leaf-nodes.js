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

import { TreeTypes, Angles } from "../../constants";
import memoise from "../../utils/memoise";

import branchScaleSelector from "../../selectors/branch-scale";
import fontSizeSelector from "../../selectors/fontSize";
import nodesSelector from "../../selectors/graph";
import styledNodesSelector from "../../selectors/styled-nodes";
import scaleSelector from "../../selectors/scale";
import stepScaleSelector from "../../selectors/step-scale";
import treeTypeSelector from "../../selectors/treeType";

const leavesPerLabelSelector = memoise(
  treeTypeSelector,
  nodesSelector,
  branchScaleSelector,
  stepScaleSelector,
  scaleSelector,
  fontSizeSelector,
  (
    treeType,
    { nodes },
    branchScale,
    stepScale,
    scale,
    fontSize,
  ) => {
    if (treeType === TreeTypes.Circular || treeType === TreeTypes.Radial) {
      const radius = (nodes.root.totalSubtreeLength * branchScale) * scale;
      const chordLength = fontSize * 0.75;
      const angle = 2 * Math.asin(chordLength / (2 * radius));
      const maxNumOfLabels = Math.floor(Angles.Degrees360 / angle);
      const leavesPerLabel = Math.ceil(nodes.root.totalLeaves / maxNumOfLabels);
      return leavesPerLabel;
    }
    else {
      // Calculate the total tree length in pixels
      const treeLength = (
        nodes.root.totalLeaves // number of leaves
        *
        stepScale // pixel per leaf node
        *
        scale // zoom scalar
      );

      // Calculate how many labels can be displayed without overlapping
      // assuming that the height of each label is equivalent to fontSize
      const maxNumOfLabels = treeLength / fontSize;

      // Finally calculate the number of leaf nodes per one label
      const leavesPerLabel = nodes.root.totalLeaves / maxNumOfLabels;

      if (leavesPerLabel <= 1) {
        return 1;
      }
      else {
        // This should return the next multiple of 2
        return 2 ** Math.ceil(Math.log(leavesPerLabel) / Math.log(2));
      }
    }
  }
);

const labelledLeafNodesSelector = memoise(
  styledNodesSelector,
  treeTypeSelector,
  leavesPerLabelSelector,
  (
    { nodes },
    type,
    leavesPerLabel,
  ) => {
    if (leavesPerLabel <= 1) {
      return [ ...nodes.leaves ];
    }

    const lastIndex = (
      nodes.leaves.length
      -
      (
        (type === TreeTypes.Circular || type === TreeTypes.Radial)
          ?
          Math.ceil(leavesPerLabel / 2)
          :
          0
      )
    );
    const nodesWithLabels = [];
    for (let index = 0; index < nodes.leaves.length; index++) {
      if (index < lastIndex && index % leavesPerLabel === 0) {
        const node = nodes.leaves[index];
        nodesWithLabels.push(node);
      }
    }

    return nodesWithLabels;
  }
);

export default labelledLeafNodesSelector;
