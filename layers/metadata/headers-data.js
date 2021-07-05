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

import { Angles } from "../../constants";

import memoise from "../../utils/memoise";

import branchScaleSelector from "../../selectors/branch-scale";
import metadataBlockLengthSelector from "../../selectors/metadataBlockLength";
import metadataColumnWidthSelector from "../../selectors/metadataColumnWidth";
import styledNodesSelector from "../../selectors/styled-nodes";
import showMetadataLabelsSelector from "../../selectors/showMetadataLabels";

export default memoise(
  styledNodesSelector,
  (tree) => tree.getAlignLeafLabels(),
  showMetadataLabelsSelector,
  (tree) => tree.props.blocks,
  metadataColumnWidthSelector,
  branchScaleSelector,
  metadataBlockLengthSelector,
  (
    { nodes },
    shouldAlignLabels,
    hasMetadataLabels,
    metadataColumns,
    columnWidths,
    branchScale,
    blockLength,
  ) => {
    const data = [];

    const firstLeaf = nodes.postorderTraversal[nodes.root.postIndex - nodes.root.totalNodes + 1];
    const inverted = (firstLeaf.angle > Angles.Degrees90) && (firstLeaf.angle < Angles.Degrees270);

    const nodePositionOffset = (
      shouldAlignLabels
        ?
        (branchScale * (nodes.root.totalSubtreeLength - firstLeaf.distanceFromRoot))
        :
        0
    );

    const nodePosition = [
      firstLeaf.x + (nodePositionOffset * Math.cos(firstLeaf.angle)),
      firstLeaf.y + (nodePositionOffset * Math.sin(firstLeaf.angle)),
    ];

    let angle = firstLeaf.angle;
    if (!hasMetadataLabels) {
      angle -= Angles.Degrees90;
    }

    let xOffset = 0;
    const offsetY = -blockLength;
    for (let index = 0; index < metadataColumns.length; index++) {
      const columnName = metadataColumns[index];
      const columnWidth = columnWidths[columnName];

      data.push({
        node: firstLeaf,
        inverted,
        position: nodePosition,
        offsetX: xOffset + (columnWidth / 2),
        offsetY,
        text: columnName,
        angle: 360 - (angle / Angles.Degrees360) * 360,
      });

      xOffset += columnWidth;
    }

    return data;
  }
);
