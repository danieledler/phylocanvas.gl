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

import defaults from "../../defaults";

import memoise from "../../utils/memoise";
import colourToRGBA from "../../utils/colour-to-rgba";

import fontColourAccessorSelector from "./font-colour-accessor";
import labelledNodesSelector from "./labelled-leaf-nodes";
import textPositionAccessorSelector from "./text-position-accessor";

import LabelsLayer from "./labels-layer";

export default memoise(
  labelledNodesSelector,
  (tree) => tree.getFontSize(),
  (tree) => tree.getFontFamily(),
  fontColourAccessorSelector,
  (tree) => tree.props.backgroundColour || defaults.backgroundColour,
  (tree) => tree.getStrokeWidth(),
  (tree) => tree.getStrokeColour(),
  (tree) => tree.getAlignLeafLabels(),
  textPositionAccessorSelector,
  (tree) => tree.getHighlightedNode(),
  (tree) => colourToRGBA(tree.props.highlightColour ?? defaults.highlightColour),
  (
    labelledNodes,
    fontSize,
    fontFamily,
    fontColour,
    backgroundColour,
    lineWidth,
    lineColour,
    alignLeafLabels,
    textPositionAccessor,
    highlightedNode,
    highlightColour,
  ) => {
    const layer = new LabelsLayer({
      alignLeafLabels,
      backgroundColour,
      data: labelledNodes,
      fontColour,
      fontFamily,
      fontSize,
      getTextPosition: textPositionAccessor,
      highlightColour,
      highlightedNode,
      id: "leaf-labels",
      lineColour,
      lineWidth: lineWidth * 0.5,
    });

    return layer;
  }
);