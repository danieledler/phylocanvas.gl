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

import { Angles, TreeTypes } from "../constants";
import memoise from "../utils/memoise";
import zoomToScale from "../utils/zoom-to-scale";

import drawingAreaSelector from "./drawing-area";
import parsedTreeSelector from "./parsedTree";
import treeTypeSelector from "./treeType";
import stepZoomSelector from "./step-zoom";

const stepRatioSelector = memoise(
  parsedTreeSelector,
  treeTypeSelector,
  drawingAreaSelector,
  (nodes, treeType, area) => {
    if (treeType === TreeTypes.Rectangular || treeType === TreeTypes.Diagonal) {
      return area.height / (nodes.root.visibleLeaves);
    }

    if (treeType === TreeTypes.Hierarchical) {
      return area.width / (nodes.root.visibleLeaves);
    }

    if (treeType === TreeTypes.Circular || treeType === TreeTypes.Radial) {
      return Angles.Degrees360 / nodes.root.visibleLeaves;
    }

    throw new Error("Invalid tree type");
  }
);
stepRatioSelector.displayName = "step-ratio";

const stepScaleSelector = memoise(
  stepRatioSelector,
  stepZoomSelector,
  (
    stepRatio,
    stepZoom,
  ) => {
    const stepScale = zoomToScale(stepZoom);
    return stepRatio * stepScale;
  },
);
stepScaleSelector.displayName = "step-scale";

export default stepScaleSelector;
