import defaults from "./defaults";

import memoise from "../../utils/memoise";

const scalebarOptionsMemo = memoise(
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
scalebarOptionsMemo.displayName = "scalebar-options";

export default scalebarOptionsMemo;
