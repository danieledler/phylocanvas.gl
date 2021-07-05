import defaults from "./defaults";

import memoise from "../../utils/memoise";

const scalebarOptionsSelector = memoise(
  (tree) => tree.props.scalebar,
  (scalebar) => {
    if (scalebar && typeof scalebar === "object") {
      return {
        ...defaults,
        ...scalebar,
      };
    }
    return defaults;
  }
);
scalebarOptionsSelector.displayName = "scalebar-options";

export default scalebarOptionsSelector;
