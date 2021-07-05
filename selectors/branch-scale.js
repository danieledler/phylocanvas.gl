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
import zoomToScale from "../utils/zoom-to-scale";

import baseLayoutSelector from "./baseLayout";
import drawingAreaSelector from "./drawing-area";
import treeTypeSelector from "./treeType";
import branchZoomSelector from "./branch-zoom";

const branchRatioSelector = memoise(
  baseLayoutSelector,
  treeTypeSelector,
  drawingAreaSelector,
  (
    baseLayout,
    treeType,
    area,
  ) => {
    const { nodes } = baseLayout;
    if (nodes.root.totalSubtreeLength > 0) {
      switch (treeType) {
        case TreeTypes.Diagonal:
        case TreeTypes.Rectangular:
          return area.width / nodes.root.totalSubtreeLength;

        case TreeTypes.Hierarchical:
          return area.height / nodes.root.totalSubtreeLength;

        case TreeTypes.Circular:
        case TreeTypes.Radial: {
          const { width, height } = baseLayout;
          const xAspectRatio = area.width / width;
          const yAspectRatio = area.height / height;
          if (xAspectRatio > yAspectRatio) {
            return (area.height) / height;
          }
          else {
            return (area.width) / width;
          }
        }
      }
    }

    throw new Error("Cannot compute default branch scale");
  }
);
branchRatioSelector.displayName = "branchRatio";

const branchScaleSelector = memoise(
  branchRatioSelector,
  branchZoomSelector,
  (
    branchRatio,
    branchZoom,
  ) => {
    const branchScale = zoomToScale(branchZoom);
    return branchRatio * branchScale;
  },
);
branchScaleSelector.displayName = "branch-scale";

export default branchScaleSelector;
