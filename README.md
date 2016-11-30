Adds a few useful variable wrappers to conole.

# Installation

1. Install greasemonkey or tampermonkey
2. Click [here](https://github.com/screepers/screeps-visual/raw/master/src/visual.screeps.user.js)
3. Click install on the resulting screen
4. Refresh screeps
5. Profit!

# Usage
visual.js implements nearly all of the canvas context API [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
```
const Visual = require('visual')
let ctx = new Visual('E0N0')
ctx.fillRect(1,1,1,1)
```
