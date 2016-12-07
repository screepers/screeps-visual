Adds a few useful variable wrappers to conole.

# Installation

1. Install greasemonkey or tampermonkey
2. Click [here](https://github.com/screepers/screeps-visual/raw/master/src/visual.screeps.user.js)
3. Click install on the resulting screen
4. Add visual.js to your screeps codebase
5. Add `RawVisual.commit()` at the end of your main loop
6. Refresh screeps
7. Profit! (Note: Nothing will render until your code tells it to, See Usage below)

# Usage
visual.js implements nearly all of the canvas context API [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
```javascript
const Visual = require('visual')
let ctx = new Visual('E0N0')
ctx.fillRect(1,1,1,1)
ctx.commit() // Commit this renderqueue, will NOT save until RawVisual.commit() is called
```

Example function to render creep paths.
```javascript

function visualizePaths(){
  let Visual = require('visual')
  let colors = []      
  let COLOR_BLACK = colors.push('#000000') - 1
  let COLOR_PATH = colors.push('rgba(255,255,255,0.5)') - 1
  _.each(Game.rooms,(room,name)=>{
    let visual = new Visual(name)
    visual.defineColors(colors)
    visual.setLineWidth = 0.5
    _.each(Game.creeps,creep=>{
      if(creep.room != room) return
      let mem = creep.memory
      if(mem._move){
        let path = Room.deserializePath(mem._move.path)
        if(path.length){
          visual.drawLine(path.map(p=>([p.x,p.y])),COLOR_PATH,{ lineWidth: 0.1 })
        }
      }
    })
    visual.commit()
  })
}
```