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
import defaults from "../defaults";

import memoise from "../utils/memoise";
import fontSizeSelector from "./fontSize";
import hasMetadataSelector from "./has-metadata";
import maxLabelWidthSelector from "./maxLabelWidth";
import metadataTotalLengthSelector from "./metadataTotalLength";
import nodeSizeSelector from "./nodeSize";
import paddingSelector from "./padding";
import showLeafLabelsSelector from "./showLeafLabels";
import showShapesSelector from "./showShapes";
import showMetadataHeadersSelector from "./show-metadata-headers";
import sizeSelector from "./size";
import treeTypeSelector from "./treeType";

export default memoise(
  treeTypeSelector,
  sizeSelector,
  (tree) => tree.props.treeToCanvasRatio || defaults.treeToCanvasRatio,
  paddingSelector,
  (tree) => (showShapesSelector(tree) ? nodeSizeSelector(tree) : 0),
  fontSizeSelector,
  (tree) => (showLeafLabelsSelector(tree) ? maxLabelWidthSelector(tree) : 0),
  showMetadataHeadersSelector,
  (tree) => (hasMetadataSelector(tree) ? metadataTotalLengthSelector(tree) : 0),
  (
    treeType,
    size,
    treeToCanvasRatio,
    padding,
    nodeSize,
    fontSize,
    maxLabelWidth,
    showMetadataHeaders,
    metadataTotalLength,
  ) => {
    let length = 0;

    length += nodeSize;
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
        preY = showMetadataHeaders ? fontSize : 0;
        postX = length;
        break;
      case TreeTypes.Hierarchical:
        preX = showMetadataHeaders ? fontSize : 0;
        postY = length;
        break;
      case TreeTypes.Circular:
      case TreeTypes.Radial:
        preX = length;
        preY = length;
        postX = length;
        postY = length;
        break;
    }

    // const left = Math.min(padding + preX, size.width * treeToCanvasRatio);
    // const top = Math.min(padding + preY, size.height * treeToCanvasRatio);
    // const right = Math.max(size.width - padding - postX, size.width * (1 - treeToCanvasRatio));
    // const bottom = Math.max(size.height - padding - postY, size.height * (1 - treeToCanvasRatio));
    // const width = (right - left);
    // const height = (bottom - top);

    let left = padding + preX;
    let top = padding + preY;
    let right = size.width - padding - postX;
    let bottom = size.height - padding - postY;

    let width = (right - left);
    if (width < size.width * treeToCanvasRatio) {
      const minLeft = size.width * (0.5 - (treeToCanvasRatio / 2));
      const maxRight = size.width * (0.5 + (treeToCanvasRatio / 2));
      if (left > minLeft && right < maxRight) {
        left = minLeft;
        right = maxRight;
      }
      else if (left > minLeft) {
        left = size.width * treeToCanvasRatio;
      }
      else if (right < maxRight) {
        right = size.width * treeToCanvasRatio;
      }
      width = (right - left);
    }

    let height = (bottom - top);
    if (height < size.height * treeToCanvasRatio) {
      const minTop = size.height * (0.5 - (treeToCanvasRatio / 2));
      const maxBottom = size.height * (0.5 + (treeToCanvasRatio / 2));
      if (top > minTop && bottom < maxBottom) {
        top = minTop;
        bottom = maxBottom;
      }
      else if (top > minTop) {
        top = size.height * treeToCanvasRatio;
      }
      else if (bottom < maxBottom) {
        bottom = size.height * treeToCanvasRatio;
      }
      height = (bottom - top);
    }

    return {
      width,
      height,
      left,
      top,
      right,
      bottom,
    };
  }
);
