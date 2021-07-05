import { TextLayer, LineLayer } from "@deck.gl/layers";
import { CompositeLayer } from "@deck.gl/core";

export default class ScalebarLayer extends CompositeLayer {
  renderLayers() {
    return [
      new TextLayer({
        id: "scalebar-text",
        data: this.props.data.labels,
        getSize: this.props.fontSize,
        getColor: this.props.fontColour,
        fontFamily: this.props.fontFamily,
        getAlignmentBaseline: "bottom",
        backgroundColor: this.props.backgroundColour,
      }),

      new LineLayer({
        id: "scalebar-lines",
        data: this.props.data.lines,
        getColor: this.props.lineColour,
        getWidth: this.props.lineWidth,
      }),
    ];
  }
}
ScalebarLayer.componentName = "ScalebarLayer";
