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

import pixelOffsetsSelector from "../selectors/pixel-offsets";
import viewStateSelector from "../selectors/viewState";
import zoomSelector from "../selectors/zoom";
import zoomToScale from "../utils/zoom-to-scale";
import nodesSelector from "../selectors/graph";

export default function (newView = {}) {
  const currentView = viewStateSelector(this);
  const newZoom = newView.zoom ?? currentView.zoom;
  const newCentre = newView.centre ?? currentView.centre;

  if (newZoom < currentView.zoom) {
    const { bounds } = nodesSelector(this);
    const pixelOffsets = pixelOffsetsSelector(this);
    const scale = zoomToScale(zoomSelector(this));
    const padding = this.getPadding();

    // const fixedScale = this.props.fixedScale;
    // this.props.fixedScale = zoomToScale(zoomSelector(this));
    // const treeBounds = this.getWorldBounds();
    // const areTreeBoundsOnScreen = (
    //   this.isTreePointOnScreen(treeBounds.min, padding)
    //   &&
    //   this.isCanvasPointOnScreen(treeBounds.max, padding)
    // );
    // this.props.fixedScale = fixedScale;

    const worldBounds = {
      min: [
        bounds.min[0] - (pixelOffsets.left / scale),
        bounds.min[1] - (pixelOffsets.top / scale),
      ],
      max: [
        bounds.max[0] + (pixelOffsets.right / scale),
        bounds.max[1] + (pixelOffsets.bottom / scale),
      ],
    };

    const areTreeBoundsOnScreen = (
      this.isCanvasPointOnScreen(
        this.projectPoint(
          worldBounds.min,
          scale,
        ),
        padding,
      )
      &&
      this.isCanvasPointOnScreen(
        this.projectPoint(
          worldBounds.max,
          scale,
        ),
        padding,
      )
    );

    if (areTreeBoundsOnScreen) {
      return;
    }
  }

  this.setProps(
    {
      fixedScale: newView.fixedScale,
      centre: newCentre,
      zoom: newZoom,
    },
    "viewport",
  );
}
