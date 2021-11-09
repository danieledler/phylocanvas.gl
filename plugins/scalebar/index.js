import renderer from "./renderer";

export default function (tree, decorate) {
  decorate("init", (delegate, args) => {

    delegate(...args);

    tree.addLayer(
      "scalebar",
      (props) => props.scalebar !== false,
      renderer,
    );
  });
}
