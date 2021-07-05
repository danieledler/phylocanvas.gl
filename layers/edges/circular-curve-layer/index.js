// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

/* eslint-disable class-methods-use-this */

import { Layer, fp64LowPart, picking, project32 } from "@deck.gl/core";
import GL from "@luma.gl/constants";
import { Model, Geometry } from "@luma.gl/core";

import vs from "./circular-curve-layer-vertex.glsl";
import fs from "./circular-curve-layer-fragment.glsl";

const NUM_SEGMENTS = 40;
const DEFAULT_COLOR = [0, 0, 0, 255];

const defaultProps = {
  strokeWidth: { type: "number", min: 0, value: 1 },
  getCentrePoint: { type: "accessor", value: (x) => x.centrePoint },
  getEndAngle: { type: "accessor", value: (x) => x.endAngle },
  getStartAngle: { type: "accessor", value: (x) => x.startAngle },
  getRadius: { type: "accessor", value: (x) => x.radius },
  getColor: { type: "accessor", value: DEFAULT_COLOR },
};

export default class CircularArcLayer extends Layer {
  getShaders() {
    return { vs, fs, modules: [project32, picking] };
  }

  initializeState() {
    const attributeManager = this.getAttributeManager();

    attributeManager.addInstanced({
      instanceCentrePoints: {
        size: 3,
        transition: false,
        accessor: "getCentrePoint",
      },
      instanceColors: {
        size: 4,
        type: GL.UNSIGNED_BYTE,
        transition: true,
        accessor: "getColor",
        defaultValue: [0, 0, 0, 255],
      },
      instanceRadius: {
        size: 1,
        transition: true,
        accessor: "getRadius",
        defaultValue: 1,
      },
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

  updateState({ props, oldProps, changeFlags }) {
    super.updateState({ props, oldProps, changeFlags });

    if (changeFlags.extensionsChanged) {
      const { gl } = this.context;
      if (this.state.model) {
        this.state.model.delete();
      }
      this.setState({ model: this._getModel(gl) });
    }
  }

  draw({ uniforms }) {
    const { strokeWidth } = this.props;

    this.state.model
      .setUniforms(
        { ...uniforms, strokeWidth }
      )
      .draw();
  }

  _getModel(gl) {
    /*
     *  (0, -1)-------------_(1, -1)
     *       |          _,-"  |
     *       o      _,-"      o
     *       |  _,-"          |
     *   (0, 1)"-------------(1, 1)
     */
    let positions = [];
    for (let i = 0; i <= NUM_SEGMENTS; i++) {
      positions = positions.concat([i, -1, 0, i, 1, 0]);
    }

    const model = new Model(
      gl,
      ({ ...this.getShaders(),
        id: this.props.id,
        geometry: new Geometry({
          drawMode: GL.TRIANGLE_STRIP,
          attributes: {
            positions: new Float32Array(positions),
          },
        }),
        isInstanced: true,
        shaderCache: this.context.shaderCache })
    );
    model.setUniforms({ numSegments: NUM_SEGMENTS });
    return model;
  }

  calculateInstanceSourceTargetPositions64xyLow(attribute) {
    const { data, getSourcePosition, getTargetPosition } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((object) => {
      const sourcePosition = getSourcePosition(object);
      const targetPosition = getTargetPosition(object);
      value[i + 0] = fp64LowPart(sourcePosition[0]);
      value[i + 1] = fp64LowPart(sourcePosition[1]);
      value[i + 2] = fp64LowPart(targetPosition[0]);
      value[i + 3] = fp64LowPart(targetPosition[1]);
      i += size;
    });
  }
}

CircularArcLayer.layerName = "CircularArcLayer";
CircularArcLayer.defaultProps = defaultProps;
