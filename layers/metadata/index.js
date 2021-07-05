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

import memoise from "../../utils/memoise";
import colourToRGBA from "../../utils/colour-to-rgba";

import blocksDataSelector from "./blocks-data";
import headersDataSelector from "./headers-data";
import pixelOffsetAccessorSelector from "./pixel-offset-accessor";
import metadataBlockLengthSelector from "../../selectors/metadataBlockLength";
import metadataHeaderStyleSelector from "../../selectors/metadataHeaderStyle";
import showMetadataHeadersSelector from "../../selectors/show-metadata-headers";

import MetadataLayer from "./metadata-layer";

export default memoise(
  blocksDataSelector,
  metadataBlockLengthSelector,
  headersDataSelector,
  metadataHeaderStyleSelector,
  pixelOffsetAccessorSelector,
  showMetadataHeadersSelector,
  (
    blockData,
    blockLength,
    headersData,
    metadataHeaderStyle,
    pixelOffsetAccessor,
    showMetadataHeaders,
  ) => {
    const layer = new MetadataLayer({
      blockLength,
      blocks: blockData,
      fontColour: colourToRGBA(metadataHeaderStyle.colour || "black"),
      fontFamily: metadataHeaderStyle.fontFamily,
      fontSize: Math.min(blockLength, metadataHeaderStyle.fontSize),
      getPixelOffset: pixelOffsetAccessor,
      hasHeaders: showMetadataHeaders,
      headers: headersData,
      id: "metadata",
    });
    return layer;
  }
);
