class Visual{
  constructor(room,scale=1){
    this.room = room  
    this.queue = []
    this.setCanvasScale(scale)
  }
  commit(json=true){
    let visual = Memory.visual || {}
    if(typeof visual == 'string') visual = JSON.parse(visual)
    visual[this.room] = this.queue    
    Memory.visual = json?JSON.stringify(visual):visual
  }
  setCanvasScale(scale=1){
    this.queue.push(`setCanvasScale [${50*scale}]`)
    this.scale(50*scale,50*scale)
  }
}

let functions = [
  'clearRect','fillRect','strokeRect','fillText','strokeText','setLineDash',
  'createLinearGradient','createRadialGradient','createPattern',
  'beginPath','closePath','moveTo','lineTo','bezierCurveTo','quadraticCurveTo','arc','arcTo','ellipse','rect',
  'fill','stroke','clip',
  'rotate','scale','translate','transform','setTransform','resetTransform',
  'save','restore'
]
let props = [
  'lineWidth','lineCap','lineJoin','miterLimit','lineDashOffset',
  'font','textAlign','textBaseline','direction',
  'fillStyle','strokeStyle',
  'shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY',
  'globalAlpha','globalCompositeOperation'
]

functions.forEach(f=>{
  Visual.prototype[f] = function(...a){ 
    this.queue.push(`${f} ${JSON.stringify(a)}`)
  }  
})

props.forEach(p=>{
  Object.defineProperty(Visual.prototype,p,{
    get: function(){
      return this[`_${p}`]
    },
    set: function(v){
      this[`_${p}`] = v
      this.queue.push(`${p} ${v}`)
    }
  })
})  

module.exports = Visual