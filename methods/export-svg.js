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

import viewportCentreSelector from "../selectors/viewportCentre";
import labelledLeafNodesSelector from "../layers/leaf-labels/labelled-leaf-nodes";
import textPositionAccessorSelector from "../layers/leaf-labels/text-position-accessor";

import shapeBorderWidthSelector from "../layers/shapes/shape-border-width";
import shapeBorderColourSelector from "../layers/shapes/border-colour";

import drawVectorShape from "../utils/draw-vector-shape";

import { Angles, TreeTypes } from "../constants";

function colourArrayToCssRGBA(colourArray) {
  const [ r, g, b, a = 255 ] = colourArray;
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

function polarToCartesian(centerX, centerY, radius, angleInRadians) {
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = (endAngle - startAngle) <= Math.PI ? "0" : "1";

  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ];

  return `<path fill="transparent" d="${d.join(" ")}" />`;
}

export default function exportSVG() {
  const nodes = this.graph();
  const size = this.getCanvasSize();
  const type = this.getTreeType();
  const nodeSize = this.getNodeSize();
  const nodeRadius = nodeSize * 0.5;
  const viewportCentre = viewportCentreSelector(this);
  const canvasCentre = this.getCanvasCentrePoint();
  const svg = [];

  const centre = [
    canvasCentre[0] + viewportCentre[0],
    canvasCentre[1] + viewportCentre[1],
  ];

  svg.push(`<svg viewBox="0 0 ${size.width} ${size.height}" xmlns="http://www.w3.org/2000/svg">\n`);

  svg.push(`<g transform="translate(${centre.join(" ")})" >\n`);

  //#region Draw lines
  const lineWidth = this.getLineWidth();
  const lineColour = colourArrayToCssRGBA(this.getLineColour());

  svg.push(`<g stroke="${lineColour}" stroke-width="${lineWidth}" >\n`);

  for (let i = nodes.firstIndex + 1; i < nodes.lastIndex; i++) {
    const node = nodes.preorderTraversal[i];

    if (type === TreeTypes.Circular) {
      svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.cx}" y2="${node.cy}"  />\n`);

      if (node.children && node.children.length && !node.isCollapsed) {
        const firstChild = node.children[0];
        const lastChild = node.children[node.children.length - 1];
        svg.push(
          describeArc(
            nodes.root.x,
            nodes.root.y,
            node.dist,
            firstChild.angle,
            lastChild.angle,
          )
        );
      }
    }
    else if (type === TreeTypes.Diagonal || type === TreeTypes.Radial) {
      svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.parent.x}" y2="${node.parent.y}"  />\n`);
    }
    else if (type === TreeTypes.Hierarchical) {
      svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.x}" y2="${node.parent.y}"  />\n`);
      svg.push(`<line x1="${node.x}" y1="${node.parent.y}" x2="${node.parent.x}" y2="${node.parent.y}"  />\n`);
    }
    else if (type === TreeTypes.Rectangular) {
      svg.push(`<line x1="${node.x}" y1="${node.y}" x2="${node.parent.x}" y2="${node.y}"  />\n`);
      svg.push(`<line x1="${node.parent.x}" y1="${node.y}" x2="${node.parent.x}" y2="${node.parent.y}"  />\n`);
    }

    // skip collapsed sub-trees
    if (node.isCollapsed) {
      i += node.totalNodes - 1;
    }
  }
  svg.push("</g>\n");

  //#endregion

  //#region Draw node shapes
  const showShapeBorders = this.props.showShapeBorders;

  let shapeBorderWidth = "";
  let shapeBorderColour = "";
  if (showShapeBorders) {
    shapeBorderWidth = shapeBorderWidthSelector(this);
    shapeBorderColour = colourArrayToCssRGBA(shapeBorderColourSelector(this));
  }

  svg.push("<g>\n");

  for (let i = nodes.firstIndex; i < nodes.lastIndex; i++) {
    const node = nodes.preorderTraversal[i];
    if (node.isLeaf && node.shape && !node.isHidden) {
      svg.push(
        drawVectorShape(
          node.shape,
          node.x,
          node.y,
          nodeRadius,
          colourArrayToCssRGBA(node.fillColour),
          shapeBorderColour,
          shapeBorderWidth,
        )
      );
    }
    // skip collapsed subtrees
    if (node.isCollapsed) {
      i += node.totalNodes - 1;
    }
  }

  svg.push("</g>\n");
  //#endregion

  //#region Draw labels

  const labelledLeafNodes = labelledLeafNodesSelector(this);
  const textPositionAccessor = textPositionAccessorSelector(this);
  const fontFamily = this.getFontFamily();
  const fontSize = this.getFontSize();
  svg.push(`<g font-family="${fontFamily.replace(/"/g, "'")}" font-size="${fontSize}">\n`);

  for (const node of labelledLeafNodes) {
    const [ x, y ] = textPositionAccessor(node);
    const degrees = ((node.angle / Angles.Degrees360) * 360) + (node.inverted ? 180 : 0);
    svg.push(`<text x="${x}" y="${y}" text-anchor="${node.inverted ? "end" : "start"}" dominant-baseline="middle" transform="rotate(${degrees},${x},${y})">${node.label}</text>\n`);
  }

  svg.push("</g>\n");

  //#endregion

  svg.push("</g>\n");

  svg.push("</svg>\n");

  return new Blob(
    svg,
    { type: "image/svg+xml" },
  );
}
