import branchScaleSelector from "../../selectors/branch-scale";
import memoise from "../../utils/memoise";
import scaleSelector from "../../selectors/scale";
import sizeSelector from "../../selectors/size";
import fontFamilySelector from "../../selectors/fontFamily";
import viewportCentreSelector from "../../selectors/viewportCentre";
import canvasCentreSelector from "../../selectors/canvasCentre";

import ScalebarLayer from "./scalebar-layer";
import scalebarOptionsSelector from "./options-selector";

const LOG10 = Math.log(10);

export default memoise(
  scalebarOptionsSelector,
  branchScaleSelector,
  scaleSelector,
  sizeSelector,
  fontFamilySelector,
  canvasCentreSelector,
  viewportCentreSelector,
  (
    options,
    branchScale,
    scale,
    size,
    fontFamily,
    canvasCentre,
    viewportCentre,
  ) => {
    const width = options.width;
    const padding = options.padding;
    const { position } = options;
    const height = options.height;

    let x = 0;
    if (typeof position.left !== "undefined") {
      x = position.left;
    }
    else if (typeof position.centre !== "undefined") {
      x = (size.width / 2) - (width / 2) + position.centre;
    }
    else if (typeof position.right !== "undefined") {
      x = size.width - width - position.right;
    }
    else {
      console.error(
        "Invalid horizontal position specified. Supported values are `left`, `centre`, or `right`"
      );
    }

    let y = 0;
    if (typeof position.top !== "undefined") {
      y = position.top;
    }
    else if (typeof position.middle !== "undefined") {
      y = (size.height / 2) - height + position.middle;
    }
    else if (typeof position.bottom !== "undefined") {
      y = (size.height) - height - position.bottom;
    }
    else {
      console.error(
        "Invalid vertical position specified. Supported values are `top`, `middle`, or `bottom`"
      );
    }

    const scaleValue = (width - padding * 2) / branchScale / scale;
    const minDigitis = parseInt(Math.abs(Math.log(scaleValue) / LOG10), 10);

    x += -canvasCentre[0];
    x /= scale;
    x += viewportCentre[0];

    y += -canvasCentre[1];
    y /= scale;
    y += viewportCentre[1];

    const left = (padding + options.lineWidth) / scale;
    const right = (width - padding - options.lineWidth) / scale;
    const bottom = (padding * 2) / scale;

    const layer = new ScalebarLayer({
      id: "scalebar-plugin",
      data: {
        labels: [
          {
            position: [
              x + (options.width / scale) / 2,
              y + (options.height / scale),
            ],
            text: scaleValue.toFixed(minDigitis + options.digits),
          },
        ],
        lines: [
          {
            sourcePosition: [ x + left, y + left ],
            targetPosition: [ x + right, y + left ],
          },
          {
            sourcePosition: [ x + left, y + left ],
            targetPosition: [ x + left, y + bottom ],
          },
          {
            sourcePosition: [ x + right, y + left ],
            targetPosition: [ x + right, y + bottom ],
          },
        ],
      },
      fontSize: options.fontSize,
      fontColour: options.fillColour,
      fontFamily: options.fontFamily || fontFamily,
      lineColour: options.strokeColour,
      lineWidth: options.lineWidth,
      backgroundColour: options.background,
    });

    return layer;
  }
);
