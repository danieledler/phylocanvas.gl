import renderer from "./renderer";

export default function (tree, decorate) {
  decorate("createLayers", (delegate, args) => {
    delegate(...args);

    tree.addLayer(
      "scalebar",
      (props) => props.scalebar !== false,
      renderer,
    );
  });
}
