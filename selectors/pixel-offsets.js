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

import fontSizeSelector from "./fontSize";
import hasMetadataSelector from "./has-metadata";
import maxLabelWidthSelector from "./maxLabelWidth";
import metadataTotalLengthSelector from "./metadataTotalLength";
import nodeSizeSelector from "./nodeSize";
import showLeafLabelsSelector from "./showLeafLabels";
import showMetadataHeadersSelector from "./show-metadata-headers";
import showShapesSelector from "./showShapes";
import treeTypeSelector from "./treeType";

const pixelOffsetsSelector = memoise(
  treeTypeSelector,
  (tree) => (showShapesSelector(tree) ? nodeSizeSelector(tree) : 0),
  (tree) => (showLeafLabelsSelector(tree) ? maxLabelWidthSelector(tree) : 0),
  (tree) => (showMetadataHeadersSelector(tree) ? fontSizeSelector(tree) : 0),
  (tree) => (hasMetadataSelector(tree) ? metadataTotalLengthSelector(tree) : 0),
  (
    treeType,
    visibleNodeSize,
    maxLabelWidth,
    metadataHeaderFontSize,
    metadataTotalLength,
  ) => {
    let length = 0;

    length += visibleNodeSize;
    length += maxLabelWidth;

    if (metadataTotalLength > 0) {
      length += metadataTotalLength;
    }

    let preX = 0;
    let postX = 0;
    let preY = 0;
    let postY = 0;
    switch (treeType) {
      case TreeTypes.Rectangular:
      case TreeTypes.Diagonal:
        preY = Math.max(
          metadataHeaderFontSize,
          visibleNodeSize / 2,
        );
        postX = length;
        postY = visibleNodeSize / 2;
        break;
      case TreeTypes.Hierarchical:
        preX = Math.max(
          metadataHeaderFontSize,
          visibleNodeSize / 2,
        );
        postY = length;
        preY = visibleNodeSize / 2;
        break;
      case TreeTypes.Circular:
      case TreeTypes.Radial:
        preX = length;
        preY = length;
        postX = length;
        postY = length;
        break;
    }

    const left = preX;
    const top = preY;
    const right = postX;
    const bottom = postY;

    return {
      width: (postX - preX),
      height: (postY - preY),
      left,
      top,
      right,
      bottom,
    };
  }
);
pixelOffsetsSelector.displayName = "pixel-offsets";

export default pixelOffsetsSelector;
