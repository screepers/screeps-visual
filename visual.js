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

class VisualEncoder {
  constructor(opts){
    this.opts = opts || {}
  }
  encode(cmds){
    return cmds
  }
  decode(cmds){
    return cmds
  }
}

class VisualCompactEncoder extends VisualEncoder {
  constructor(opts){
    super(opts)
    this.opts.mode = this.opts.mode || 'base64'
    this.opts.compress = this.opts.compress || false
    this.map = { encode: {}, decode: {} }
    this.types = { encode: {}, decode: {} }
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
    let types = [
      "__DUMMY__",
      "string",
      "number"
    ]
    functions.forEach((v,k)=>{
      this.map.encode[v] = k
      this.map.decode[k] = v
    })
    props.forEach((v,k)=>{
      k += 127
      this.map.encode[v] = k
      this.map.decode[k] = v
    })
    types.forEach((v,k)=>{
      this.types.encode[v] = k
      this.types.decode[k] = v
    })
  }
  encode(cmds){
    cmds = cmds.map(rawcmd=>{
      let [cmd,...args] = rawcmd
      cmd = this.map.encode[cmd]
      cmd = String.fromCharCode(cmd)
      cmd += String.fromCharCode(args.length)
      args = args.map(a=>{
        let oa = a
        let type = this.types.encode[typeof a]
        let metadata = 0
        if(typeof a == 'number')
          a = this.encodeNumber(a)
        metadata = a.length
        let fb = this.toHiLo(type,metadata)
        fb = String.fromCharCode(fb)
        return `${fb}${a}`
      }).join('')
      return `${cmd}${args}`
    }).join('')
    return cmds
  }

  decode(cmds){
    let i = 0;
    let ret = []
    while(i < cmds.length){
      let cmd = cmds.charCodeAt(i++)
      let argcnt = cmds.charCodeAt(i++)
      cmd = this.map.decode[cmd]
      let args = []
      while(argcnt--){
        let [type,metadata] = this.fromHiLo(cmds.charCodeAt(i++))
        type = this.types.decode[type]
        let data = cmds.substr(i,metadata)
        i += metadata
        if(type == 'number')
          data = this.decodeNumber(data)
        args.push(data)
      }
      ret.push([cmd,...args])
    }
    return ret
  }

  encodeNumber(n){
    let ret = ''
    n >>>= 0
    while(n > 0){
      let v = n & 0xFF
      n >>>= 8
      ret += String.fromCharCode(v)
    }
    return ret
  }

  decodeNumber(data){
    if(!data.length) return 0
    let ret = 0
    let i = data.length - 1
    do{
      ret <<= 8
      ret += data.charCodeAt(i)
    }while(i-- > 0)
    return ret
  }

  toHiLo(hi,lo){
    return (((hi & 0x0F) << 4) + (lo & 0x0F)) >>> 0
  }

  fromHiLo(hilo){
    return [
      (hilo & 0xF0) >>> 4,
      (hilo & 0x0F) >>> 0
    ]
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

if(require.main == module){
  let testdata = JSON.parse("{\"E6N29\":[\"save []\",\"beginPath []\",\"moveTo [1625,975]\",\"lineTo [1675,975]\",\"lineTo [1725,975]\",\"lineTo [1775,975]\",\"lineTo [1825,1025]\",\"lineTo [1875,1075]\",\"lineTo [1925,1125]\",\"strokeStyle #CCCCCC\",\"lineWidth 25\",\"lineCap round\",\"stroke []\",\"restore []\",\"save []\",\"beginPath []\",\"moveTo [1625,975]\",\"lineTo [1675,975]\",\"lineTo [1725,975]\",\"lineTo [1775,975]\",\"lineTo [1825,1025]\",\"lineTo [1875,1075]\",\"lineTo [1925,1125]\",\"lineTo [1925,1175]\",\"lineTo [1875,1225]\",\"lineTo [1875,1275]\",\"lineTo [1875,1325]\",\"strokeStyle #CCCCCC\",\"lineWidth 25\",\"lineCap round\",\"stroke []\",\"restore []\",\"save []\",\"beginPath []\",\"moveTo [1575,925]\",\"lineTo [1575,875]\",\"lineTo [1525,825]\",\"lineTo [1525,775]\",\"lineTo [1475,725]\",\"lineTo [1475,675]\",\"lineTo [1475,625]\",\"lineTo [1475,575]\",\"lineTo [1475,525]\",\"lineTo [1425,475]\",\"lineTo [1375,425]\",\"lineTo [1325,375]\",\"lineTo [1275,375]\",\"lineTo [1225,375]\",\"lineTo [1175,375]\",\"lineTo [1125,375]\",\"lineTo [1075,425]\",\"lineTo [1025,475]\",\"lineTo [975,525]\",\"lineTo [925,575]\",\"lineTo [875,575]\",\"lineTo [825,625]\",\"lineTo [775,675]\",\"lineTo [725,675]\",\"lineTo [675,675]\",\"lineTo [625,675]\",\"lineTo [575,675]\",\"lineTo [525,675]\",\"lineTo [475,625]\",\"lineTo [425,575]\",\"lineTo [375,525]\",\"strokeStyle #CCCCCC\",\"lineWidth 25\",\"lineCap round\",\"stroke []\",\"restore []\"],\"E3N31\":[\"setCanvasScale [50]\",\"scale [50,50]\"],\"E9N31\":[\"setCanvasScale [50]\",\"scale [50,50]\",\"fillStyle rgba(255,255,255,0.3)\",\"fillRect [19,25,1,1]\",\"fillRect [20,24,1,1]\",\"fillRect [20,26,1,1]\",\"fillRect [21,24,1,1]\",\"fillRect [21,26,1,1]\",\"fillRect [22,25,1,1]\",\"fillRect [24,20,1,1]\",\"fillRect [24,21,1,1]\",\"fillRect [24,29,1,1]\",\"fillRect [24,30,1,1]\",\"fillRect [25,19,1,1]\",\"fillRect [25,22,1,1]\",\"fillRect [25,28,1,1]\",\"fillRect [25,31,1,1]\",\"fillRect [26,20,1,1]\",\"fillRect [26,21,1,1]\",\"fillRect [26,29,1,1]\",\"fillRect [26,30,1,1]\",\"fillRect [28,25,1,1]\",\"fillRect [29,24,1,1]\",\"fillRect [29,26,1,1]\",\"fillRect [30,24,1,1]\",\"fillRect [30,26,1,1]\",\"fillRect [31,25,1,1]\"]}")
  testdata = testdata.E6N29
  testdata = testdata.map(d=>{
    let [cmd,args] = d.split(' ')
    if(args[0] == '[') args = JSON.parse(args)
    else args = [args]
    return [cmd,...args]
  })
  let orig = JSON.stringify(testdata)
  console.log('Orig:',orig.length)
  let enc = new VisualCompactEncoder()
  let encoded = enc.encode(testdata)
  console.log('Encoded:',encoded.length)
  console.log('Encoded (base64):',btoa(encoded).length)
  let decoded = enc.decode(encoded)
  let decodedLen = JSON.stringify(decoded).length
  console.log('Decoded:',decodedLen)
}  

function btoa(v){
  return new Buffer(v).toString('base64')
}

function atob(v){
  return new Buffer(v,'base64').toString('utf8')
}