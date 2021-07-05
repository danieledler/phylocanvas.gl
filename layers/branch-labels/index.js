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

import { TextLayer } from "@deck.gl/layers";

import fontColourSelector from "./font-colour";
import fontFamilySelector from "../../selectors/fontFamily";
import fontSizeSelector from "../../selectors/fontSize";
import internalNodesSelector from "./internal-nodes";
import pixelOffsetAccessorSelector from "./pixel-offset-accessor";
import positionAccessorSelector from "./position-accessor";

import nodeAngleInDegrees from "../../utils/node-angle-in-degrees";
import memoise from "../../utils/memoise";

function getExponentialText(datum) {
  return datum.branchLength?.toExponential();
}

function getFixedText(datum) {
  return datum.branchLength?.toFixed(4);
}

export default memoise(
  internalNodesSelector,
  fontSizeSelector,
  fontFamilySelector,
  fontColourSelector,
  pixelOffsetAccessorSelector,
  (tree) => tree.props.exponentialBranchLengths,
  positionAccessorSelector,
  (
    internalNodes,
    fontSize,
    fontFamily,
    fontColour,
    pixelOffsetAccessor,
    exponentialBranchLengths,
    positionAccessor,
  ) => {
    const layer = new TextLayer({
      data: internalNodes,
      fontFamily,
      getAngle: nodeAngleInDegrees,
      getColor: fontColour,
      getPixelOffset: pixelOffsetAccessor,
      getPosition: positionAccessor,
      getSize: fontSize * 0.6,
      getText: exponentialBranchLengths ? getExponentialText : getFixedText,
      getTextAnchor: "middle",
      id: "branch-labels",
      updateTriggers: { getPixelOffset: pixelOffsetAccessor },
    });
    return layer;
  }
);
