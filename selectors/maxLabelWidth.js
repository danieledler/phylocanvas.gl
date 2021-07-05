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

import memoise from "../utils/memoise";
import measureTextWidth from "../utils/measure-text-width";
import parsedTreeSelector from "./parsedTree";
import fontFamilySelector from "./fontFamily";
import fontSizeSelector from "./fontSize";

const findLongestLabel = memoise(
  parsedTreeSelector,
  (tree) => tree.props.styles,
  (nodes, styles = {}) => {
    let maxLabel = "";
    for (let i = 0; i < nodes.root.totalNodes; i++) {
      const node = nodes.preorderTraversal[nodes.root.preIndex + i];
      if (node.isLeaf && !node.isHidden) {
        const label = (node.id in styles ? styles[node.id].label : null) || node.label || node.id;
        if (label.length > maxLabel.length) {
          maxLabel = label;
        }
      }
    }
    return maxLabel;
  }
);
findLongestLabel.displayName = "findLongestLabel";

export default memoise(
  findLongestLabel,
  fontFamilySelector,
  fontSizeSelector,
  (
    text,
    fontFamily,
    fontSize,
  ) => {
    const width = measureTextWidth(text, fontFamily, fontSize);
    return width;
  }
);
