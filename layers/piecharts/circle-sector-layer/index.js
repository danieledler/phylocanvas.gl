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

import { ScatterplotLayer } from "@deck.gl/layers";

class CircleSectorLayer extends ScatterplotLayer {
  getShaders(id) {
    return {
      ...super.getShaders(),
      inject: {
        "vs:#decl": `
          attribute float instanceStartAngle;
          attribute float instanceEndAngle;
          varying vec2 sectorStart;
          varying vec2 sectorEnd;        
        `,
        "vs:#main-start": `
          sectorStart = vec2(cos(instanceStartAngle), sin(instanceStartAngle));
          sectorEnd = vec2(cos(instanceEndAngle), sin(instanceEndAngle));              
        `,
        "fs:#decl": `
          varying vec2 sectorStart;
          varying vec2 sectorEnd;        
        `,
        "fs:DECKGL_FILTER_COLOR": `
          if (-sectorStart.x * geometry.uv.y + sectorStart.y * geometry.uv.x > 0.0) {
            discard;
          }
          if (-sectorEnd.x * geometry.uv.y + sectorEnd.y * geometry.uv.x < 0.0) {
            discard;
          }
        `,
      },
    };
  }

  initializeState() {
    super.initializeState();
    this.getAttributeManager().addInstanced({
      instanceStartAngle: {
        size: 1,
        transition: true,
        accessor: "getStartAngle",
        defaultValue: 1,
      },
      instanceEndAngle: {
        size: 1,
        transition: true,
        accessor: "getEndAngle",
        defaultValue: 1,
      },
    });
  }
}
CircleSectorLayer.componentName = "CircleSectorLayer";

export default CircleSectorLayer;
