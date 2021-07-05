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

/* eslint-disable quote-props */

export default {
  "addLayer": require("./add-layer").default,
  "ascendingNodeOrder": require("./ascending-node-order").default,
  "collapseNode": require("./collapse-node").default,
  "descendingNodeOrder": require("./descending-node-order").default,
  "destroy": require("./destroy").default,
  "exportJSON": require("./export-json").default,
  "exportNewick": require("./export-newick").default,
  "exportPNG": require("./export-png").default,
  "exportSVG": require("./export-svg").default,
  "findNodeById": require("./find-node-by-id").default,
  "fitInCanvas": require("./fit-in-canvas").default,
  "getAlignLeafLabels": require("./get-align-leaf-labels").default,
  "getBranchScale": require("./getBranchScale").default,
  "getBranchZoom": require("./getBranchZoom").default,
  "branchZoomingAxis": require("./branch-zooming-axis").default,
  "getCanvasCentrePoint": require("./getCanvasCentrePoint").default,
  "getCanvasSize": require("./getCanvasSize").default,
  "getDrawingArea": require("./getDrawingArea").default,
  "getFontFamily": require("./getFontFamily").default,
  "getFontSize": require("./getFontSize").default,
  "getLineColour": require("./getLineColour").default,
  "getLineWidth": require("./getLineWidth").default,
  "getMainAxis": require("./getMainAxis").default,
  "getMaxZoom": require("./getMaxZoom").default,
  "getMinZoom": require("./getMinZoom").default,
  "getNodeSize": require("./getNodeSize").default,
  "getPadding": require("./getPadding").default,
  "getScale": require("./getScale").default,
  "getStepScale": require("./getStepScale").default,
  "getStepZoom": require("./getStepZoom").default,
  "getStepZoomingAxis": require("./getStepZoomingAxis").default,
  "getTreeType": require("./getTreeType").default,
  "getWorldBounds": require("./getWorldBounds").default,
  "getZoom": require("./getZoom").default,
  "graph": require("./graph").default,
  "handleClick": require("./handleClick").default,
  "handleHover": require("./handleHover").default,
  "highlightNode": require("./highlightNode").default,
  "importJSON": require("./import-json").default,
  "isCanvasPointOnScreen": require("./isCanvasPointOnScreen").default,
  "isOrthogonal": require("./isOrthogonal").default,
  "isTreePointOnScreen": require("./isTreePointOnScreen").default,
  "midpointRoot": require("./midpointRoot").default,
  "nodeAtScreen": require("./nodeAtScreen").default,
  "nodeFromLayer": require("./nodeFromLayer").default,
  "projectPoint": require("./projectPoint").default,
  "render": require("./render").default,
  "rerootNode": require("./rerootNode").default,
  "resetCollapsedNodes": require("./resetCollapsedNodes").default,
  "resetRotatedNodes": require("./resetRotatedNodes").default,
  "resize": require("./resize").default,
  "resume": require("./resume").default,
  "rotateNode": require("./rotateNode").default,
  "selectLeafNodes": require("./selectLeafNodes").default,
  "selectNode": require("./selectNode").default,
  "setBranchZoom": require("./setBranchZoom").default,
  "setProps": require("./setProps").default,
  "setRoot": require("./setRoot").default,
  "setScale": require("./setScale").default,
  "setSource": require("./setSource").default,
  "setStepZoom": require("./setStepZoom").default,
  "setTooltip": require("./setTooltip").default,
  "setTreeType": require("./setTreeType").default,
  "setView": require("./setView").default,
  "setZoom": require("./setZoom").default,
  "suspend": require("./suspend").default,
  "unprojectPoint": require("./unprojectPoint").default,
};
