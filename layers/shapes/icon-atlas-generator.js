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

import { Angles } from "../../constants";

function star(ctx, x, y, MARKER_CENTRE, spikes = 5) {
  const outerRadius = MARKER_CENTRE;
  const innerRadius = outerRadius * 0.5;
  const step = Math.PI / spikes;

  let rot = Math.PI / 2 * 3;
  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(x, y - outerRadius);
}

function polygon(ctx, x, y, MARKER_CENTRE, sides) {
  const baseAngle = Angles.Degrees270;
  const angle = Angles.Degrees360 / sides;
  ctx.moveTo(
    x + MARKER_CENTRE * Math.cos(baseAngle),
    y + MARKER_CENTRE * Math.sin(baseAngle),
  );
  for (let i = 1; i <= sides; i += 1) {
    ctx.lineTo(
      x + MARKER_CENTRE * Math.cos(baseAngle + i * angle),
      y + MARKER_CENTRE * Math.sin(baseAngle + i * angle),
    );
  }
}

function defineShapes() {
  const shapes = [];

  shapes.push({
    name: "dot",
    render(ctx, size) {
      ctx.arc(0, 0, size / 8, Angles.Degrees0, Angles.Degrees360);
    },
  });

  shapes.push({
    name: "circle",
    render(ctx, size) {
      const nodeRadius = size / 2;
      ctx.arc(0, 0, nodeRadius, Angles.Degrees0, Angles.Degrees360);
    },
  });

  shapes.push({
    name: "square",
    render(ctx, size) {
      const nodeRadius = size / 2;
      ctx.rect(-nodeRadius, -nodeRadius, size, size);
    },
  });

  shapes.push({
    name: "triangle",
    render(ctx, size) {
      const radius = size / 2;
      polygon(ctx, 0, 0, radius, 3);
      // ctx.moveTo(0, -radius);
      // ctx.lineTo(radius, radius);
      // ctx.lineTo(-radius, radius);
      // ctx.lineTo(0, -radius);
    },
  });

  shapes.push({
    name: "star",
    render(ctx, size) {
      const nodeRadius = size / 2;
      const step = Math.PI / 5;
      let angle = Math.PI / 2 * 3;
      ctx.moveTo(0, -nodeRadius);
      for (let j = 0; j < 5; j++) {
        ctx.lineTo(Math.cos(angle) * nodeRadius, Math.sin(angle) * nodeRadius);
        angle += step;
        ctx.lineTo(Math.cos(angle) * nodeRadius * 0.5, Math.sin(angle) * nodeRadius * 0.5);
        angle += step;
      }
      ctx.lineTo(0, -nodeRadius);
    },
  });

  shapes.push({
    name: "hexastar",
    render(ctx, size) {
      const radius = size / 2;
      star(ctx, 0, 0, radius, 6);
    },
  });
  shapes.push({
    name: "heptastar",
    render(ctx, size) {
      const radius = size / 2;
      star(ctx, 0, 0, radius, 7);
    },
  });
  shapes.push({
    name: "octastar",
    render(ctx, size) {
      const radius = size / 2;
      star(ctx, 0, 0, radius, 8);
    },
  });
  shapes.push({
    name: "pentagon",
    render(ctx, size) {
      const radius = size / 2;
      polygon(ctx, 0, 0, radius, 5);
    },
  });
  shapes.push({
    name: "hexagon",
    render(ctx, size) {
      const radius = size / 2;
      polygon(ctx, 0, 0, radius, 6);
    },
  });
  shapes.push({
    name: "heptagon",
    render(ctx, size) {
      const radius = size / 2;
      polygon(ctx, 0, 0, radius, 7);
    },
  });
  shapes.push({
    name: "octagon",
    render(ctx, size) {
      const radius = size / 2;
      polygon(ctx, 0, 0, radius, 8);
    },
  });

  shapes.push({
    name: "uk",
    render(ctx, size) {
      const radius = size / 2;
      ctx.fillText("🇬🇧", 0, 0 - radius);
    },
    text: true,
  });

  return shapes;
}

function drawShapes(shapes, size, padding) {
  const shapeSize = size - padding;
  const borderSize = shapeSize / 16;
  const imageSize = size;
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = shapes.length * imageSize;
  tmpCanvas.height = size;
  const ctx = tmpCanvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.strokeStyle = "red";
  ctx.lineWidth = borderSize;
  ctx.globalAlpha = 1;
  ctx.font = `${size}px Segoe UI Emoji`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  for (let index = 0; index < shapes.length; index++) {
    const element = shapes[index];

    ctx.save();

    ctx.translate(
      (index * imageSize) + (imageSize / 2),
      imageSize / 2,
    );

    // ctx.beginPath();
    // element.render(ctx, shapeSize);
    // ctx.fill();
    // ctx.stroke();
    // ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "white";
    element.render(ctx, shapeSize);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    element.render(ctx, shapeSize - 2);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

  // let c = 0;
  // for (let i = 0; i < 16; i++) {
  //   for (let j = 0; j < 16; j++) {
  //     const { data } = ctx.getImageData(i, j, 1, 1);
  //     if (data[0] === 0) {
  //       c++;
  //     }
  //     console.log(i, j, data);
  //   }
  // }
  // console.log({c})

  return tmpCanvas.toDataURL();
}

function createMapping(shapes, size, padding) {
  const imageSize = size;
  const shapeSize = size - padding;

  const mapping = {};

  for (let index = 0; index < shapes.length; index++) {
    const element = shapes[index];

    mapping[element.name] = {
      x: (index * imageSize) + (padding / 2),
      y: padding / 2,
      width: shapeSize,
      height: shapeSize,
      mask: !element.text,
    };
  }

  return mapping;
}

function generateAtlas(radius = 64, padding = 4) {
  const size = radius + padding;
  const shapes = defineShapes();

  const image = drawShapes(shapes, size, padding);

  const mapping = createMapping(shapes, size, padding);

  return {
    image,
    mapping,
  };
}

let atlas;

export default function () {
  if (!atlas) {
    atlas = generateAtlas();
  }
  return atlas;
}
