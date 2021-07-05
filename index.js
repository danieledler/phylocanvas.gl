import * as constants from "./constants";
import defaults from "./defaults";
import PhylocanvasGL from "./PhylocanvasGL";
import newick from "./utils/newick";

Object.assign(
  PhylocanvasGL,
  constants,
);

PhylocanvasGL.defaults = defaults;

export { default as PhylocanvasGL } from "./PhylocanvasGL";
export * from "./constants";

export { default as Defaults } from "./defaults";

export const Newick = newick;

export default PhylocanvasGL;
