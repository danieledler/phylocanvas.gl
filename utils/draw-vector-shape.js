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

/* eslint-disable no-lonely-if */

import { Flags, isEmojiRegexp } from "./emoji";

function star(x, y, MARKER_CENTRE, spikes = 5, fillColour, borderColour, borderWidth) {
  const outerRadius = MARKER_CENTRE;
  const innerRadius = outerRadius * 0.5;
  const step = Math.PI / spikes;

  let rot = Math.PI / 2 * 3;
  const points = [
    `${x},${y - outerRadius}`,
  ];

  for (let i = 0; i < spikes; i++) {
    points.push(`${x + Math.cos(rot) * outerRadius},${y + Math.sin(rot) * outerRadius}`);
    rot += step;
    points.push(`${x + Math.cos(rot) * innerRadius},${y + Math.sin(rot) * innerRadius}`);
    rot += step;
  }
  points.push(`${x},${y - outerRadius}`);

  return `<polygon points="${points.join(" ")}" fill="${fillColour}" stroke="${borderColour}" stroke-width="${borderWidth}" />`;
}

function polygon(x, y, MARKER_CENTRE, sides, fillColour, borderColour, borderWidth) {
  const points = [
    `${x + MARKER_CENTRE * Math.cos(Math.PI / 2 * 3)},${y + MARKER_CENTRE * Math.sin(Math.PI / 2 * 3)}`,
  ];
  for (let i = 1; i <= sides; i += 1) {
    const angle = (Math.PI / 2 * 3) + (i * 2 * Math.PI / sides);
    points.push(`${x + MARKER_CENTRE * Math.cos(angle)},${y + MARKER_CENTRE * Math.sin(angle)}`);
  }
  return `<polygon points="${points.join(" ")}" fill="${fillColour}" stroke="${borderColour}" stroke-width="${borderWidth}" />`;
}

export default function drawVectorShape(shape, x, y, radius, fillColour, borderColour, borderWidth) {
  if (radius <= 0 || shape === "none") {
    return "";
  }

  if (shape in Flags) {
    return `<text x="${x}" y="${y}" font-size="${radius * 2}px" font-family="Segoe UI Emoji" text-anchor="middle" dominant-baseline="middle" fill="${fillColour}">${Flags[shape]}</text>`;
  }

  else if (isEmojiRegexp.test(shape)) {
    return `<text x="${x}" y="${y}" font-size="${radius * 2}px" font-family="Segoe UI Emoji" text-anchor="middle" dominant-baseline="middle" fill="${fillColour}">${shape}</text>`;
  }

  else {
    if (shape === "dot") {
      return `<circle cx="${x}" cy="${y}" r="${1}" fill="${fillColour}" stroke="${borderColour}" stroke-width="${borderWidth}" />`;
    }
    else if (shape === "circle") {
      return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fillColour}" stroke="${borderColour}" stroke-width="${borderWidth}" />`;
    }
    else if (shape === "square") {
      return `<g transform="translate(${x} ${y})"><rect x="${-radius}" y="${-radius}" width="${radius * 2}" height="${radius * 2}" fill="${fillColour}" stroke="${borderColour}" stroke-width="${borderWidth}" /></g>`;
    }
    else if (shape === "triangle") {
      return `<polygon points="${x},${y - radius} ${x + radius},${y + radius} ${x - radius},${y + radius} ${x},${y - radius}" fill="${fillColour}" stroke="${borderColour}" stroke-width="${borderWidth}" />`;
    }
    else if (shape === "star") {
      return star(x, y, radius, 5, fillColour, borderColour, borderWidth);
    }
    else if (shape === "hexastar") {
      return star(x, y, radius, 6, fillColour, borderColour, borderWidth);
    }
    else if (shape === "heptastar") {
      return star(x, y, radius, 7, fillColour, borderColour, borderWidth);
    }
    else if (shape === "octastar") {
      return star(x, y, radius, 8, fillColour, borderColour, borderWidth);
    }
    else if (shape === "pentagon") {
      return polygon(x, y, radius, 5, fillColour, borderColour, borderWidth);
    }
    else if (shape === "hexagon") {
      return polygon(x, y, radius, 6, fillColour, borderColour, borderWidth);
    }
    else if (shape === "heptagon") {
      return polygon(x, y, radius, 7, fillColour, borderColour, borderWidth);
    }
    else if (shape === "octagon") {
      return polygon(x, y, radius, 8, fillColour, borderColour, borderWidth);
    }
    else {
      throw new Error(`Invalid shape ${shape}`);
    }
  }
}
