
import memoise from "../utils/memoise";
import measureTextWidth from "../utils/measure-text-width";
import metadataBlockLengthSelector from "./metadataBlockLength";
import metadataBlockPaddingSelector from "./metadataBlockPadding";
import metadataHeaderStyleSelector from "./metadataHeaderStyle";
import metadataLabelStyleSelector from "./metadataLabelStyle";
import parsedTreeSelector from "./parsedTree";
import showMetadataHeadersSelector from "./show-metadata-headers// Phylocanvas.gl (https://phylocanvas.gl)
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

";
import showMetadataLabelsSelector from "./showMetadataLabels";

const metadataLabelWidthSelector = memoise(
  parsedTreeSelector,
  (tree) => tree.props.metadata,
  (tree) => tree.props.blocks,
  metadataLabelStyleSelector,
  (
    nodes,
    metadataValues = {},
    columns = [],
    labelStyle,
  ) => {
    const columnWidths = {};

    for (const columnName of columns) {
      // find the text of the longest label
      let maxLabel = "";

      for (const nodeId of Object.keys(metadataValues)) {
        const node = nodes.ids[nodeId];
        if (node) {
          const data = metadataValues[node.id][columnName];
          if (data.label && data.label.length > maxLabel.length) {
            maxLabel = data.label;
          }
        }
      }

      // measure the actual width of the longest label if found
      if (maxLabel && maxLabel.length) {
        columnWidths[columnName] = measureTextWidth(maxLabel, labelStyle.fontFamily, labelStyle.fontSize);
      } else {
        columnWidths[columnName] = 0;
      }
    }

    return columnWidths;
  }
);
metadataLabelWidthSelector.displayName = "metadataLabelWidth";

const metadataHeaderWidthSelector = memoise(
  (tree) => tree.props.blocks,
  metadataHeaderStyleSelector,
  (columns, headerStyle) => {
    const headerWidths = {};
    for (const columnName of columns) {
      headerWidths[columnName] = (
        2 * headerStyle.fontSize +
        measureTextWidth(columnName, headerStyle.fontFamily, headerStyle.fontSize)
      );
    }

    return headerWidths;
  }
);
metadataHeaderWidthSelector.displayName = "metadataHeaderWidth";

export default memoise(
  (tree) => tree.props.blocks,
  metadataBlockLengthSelector,
  metadataBlockPaddingSelector,
  showMetadataHeadersSelector,
  showMetadataLabelsSelector,
  (tree) => (
    showMetadataLabelsSelector(tree) && showMetadataHeadersSelector(tree) ?
      metadataHeaderWidthSelector(tree) :
      null
  ),
  (tree) => (showMetadataLabelsSelector(tree) ? metadataLabelWidthSelector(tree) : null),
  (
    columnNames = [],
    blockLength,
    blockPadding,
    showMetadataHeaders,
    showMetadataLabels,
    headerWidths,
    labelWidths,
  ) => {
    const columnWidths = {};
    for (const columnName of columnNames) {
      let columnWidth = 0;

      if (showMetadataHeaders && showMetadataLabels) {
        columnWidth += Math.max(
          (headerWidths[columnName]),
          blockLength + (2 * blockPadding) + (labelWidths[columnName])
        );
      }
      else if (showMetadataHeaders) {
        columnWidth += blockLength + blockPadding;
      }
      else if (showMetadataLabels) {
        columnWidth += blockLength + (2 * blockPadding) + (labelWidths[columnName]);
      }
      else {
        columnWidth += blockLength + blockPadding;
      }

      columnWidths[columnName] = columnWidth;
    }

    return columnWidths;
  }
);
