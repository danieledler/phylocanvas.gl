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

import parse from "../utils/parse-source-as-graph";
import rotateSubtree from "../utils/rotate-subtree";

const parseSourceSelector = memoise(
  (tree) => tree.props.source,
  (source) => {
    const { nodeById, rootNode, postorderTraversal, preorderTraversal } = parse(source);
    const nodes = {
      ids: nodeById,
      postorderTraversal,
      preorderTraversal,
      source,
      originalRoot: rootNode,
      originalSource: source.original || source,
    };
    return nodes;
  }
);
parseSourceSelector.displayName = "parseSource";

const rotateNodesSelector = memoise(
  parseSourceSelector,
  (tree) => tree.props.rotatedIds,
  (nodes, rotatedIds) => {
    const rotatedIdsSet = new Set(rotatedIds || []);

    if (nodes.rotatedIds) {
      for (const id of nodes.rotatedIds) {
        const node = nodes.ids[id];
        if (rotatedIdsSet.has(node.id)) {
          continue;
        }
        rotateSubtree(nodes, node);
        node.isRotated = false;
      }
    }

    for (const id of rotatedIdsSet) {
      const node = nodes.ids[id];
      if (node.isRotated) {
        continue;
      }
      rotateSubtree(nodes, node);
      node.isRotated = true;
    }

    return rotatedIdsSet;
  }
);
rotateNodesSelector.displayName = "rotateNodes";

const collapseNodesSelector = memoise(
  parseSourceSelector,
  (tree) => tree.props.collapsedIds,
  (nodes, ids) => {
    const collapsedIds = new Set(ids);

    for (let i = 1; i < nodes.postorderTraversal.length; i++) {
      const node = nodes.preorderTraversal[i];
      node.isCollapsed = collapsedIds.has(node.id);
      node.isHidden = (node.parent.isCollapsed || node.parent.isHidden);
      // if (node.parent && (node.parent.isCollapsed || node.parent.isHidden)) {
      //   node.isHidden = true;
      // }
      // else {
      //   node.isHidden = false;
      // }
    }

    for (let i = 0; i < nodes.postorderTraversal.length; i++) {
      const node = nodes.postorderTraversal[i];
      if (node.isLeaf) {
        node.visibleLeaves = 1;
      } else if (node.isCollapsed) {
        node.visibleLeaves = 1;
      } else {
        node.visibleLeaves = 0;
        for (const child of node.children) {
          node.visibleLeaves += child.visibleLeaves;
        }
      }
    }

    return collapsedIds;
  }
);
collapseNodesSelector.displayName = "collapseNodes";

export default memoise(
  parseSourceSelector,
  rotateNodesSelector,
  collapseNodesSelector,
  (tree) => tree.props.rootId,
  (nodes, rotatedIds, collapsedIds, rootId) => {
    // nodes.rotatedIds = rotatedIds;
    // nodes.collapsedIds = collapsedIds;

    const root = nodes.ids[rootId] || nodes.preorderTraversal[0];
    root.distanceFromRoot = 0;
    for (let i = 1; i < root.totalNodes; i++) {
      const node = nodes.preorderTraversal[root.preIndex + i];
      node.distanceFromRoot = node.parent.distanceFromRoot + node.branchLength;
    }

    const firstIndex = root.preIndex;
    const lastIndex = root.preIndex + root.totalNodes;

    // Update leaf nodes
    const leaves = [];
    for (let i = 1; i < root.totalNodes; i++) {
      const node = nodes.preorderTraversal[root.preIndex + i];
      if (node.isLeaf) {
        leaves.push(node);
      }
      // skip collapsed subtrees
      if (node.isCollapsed) {
        i += node.totalNodes - 1;
      }
    }

    return {
      ...nodes,
      root,
      firstIndex,
      lastIndex,
      leaves,
    };
  }
);
