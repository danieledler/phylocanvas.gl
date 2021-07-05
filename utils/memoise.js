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

/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-spread */
/* eslint prefer-rest-params: 0 */

let total = 0;

function createMemo(...dependencies) {
  const resultFunc = dependencies.pop();

  let lastProps = null;
  let lastArgs = null;
  let lastResult = null;
  const selector = function (context) {
    if (lastProps === null || context.props === null || lastProps !== context.props) {
      const args = [];

      for (let i = 0; i < dependencies.length; i++) {
        args.push(dependencies[i].call(null, context));
      }

      args.push(context);

      let recompute = false;
      if (lastArgs === null || args === null || lastArgs.length !== args.length) {
        recompute = true;
      } else {
        for (let i = 0; i < args.length; i++) {
          if ((lastArgs[i] !== args[i])) {
            recompute = true;
            break;
          }
        }
      }
      if (recompute) {
        const t0 = performance.now();
        lastResult = resultFunc.apply(null, args);
        const t1 = performance.now();
        if (selector.displayName) {
          total += (t1 - t0);
          context.log && context.log("selector %s took:", selector.displayName, t1 - t0, /* total */);
        }
      }

      lastArgs = args;
    }

    lastProps = context.props;
    return lastResult;
  };
  return selector;
}

export default function memoise() {
  const cache = new WeakMap();

  const dependencies = arguments;

  const selector = function (tree) {
    let cachedSelector = cache.get(tree);

    if (cachedSelector === undefined) {
      cachedSelector = createMemo.apply(null, dependencies);
      cachedSelector.displayName = selector.displayName;
      cache.set(tree, cachedSelector);
    }

    return cachedSelector.apply(null, arguments);
  };
  selector.cache = cache;

  return selector;
}
