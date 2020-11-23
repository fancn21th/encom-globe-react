function isPowerOfTwo(x) {
    return Math.log2(x) % 1 === 0;
}
//NOTE: version 88 of THREE changed the way textured canvas are scaled opting to down scale to the lower power of two.
// Example: 500px goes down to 256px in version 88 and up vs 512px on versions 87 and down.
function nearestPowerOf2(n, underLine) {
    const upper = 2 << 31 - Math.clz32(n);
    if(!underLine){
        return upper;
    }
    const lower = 1 << 31 - Math.clz32(n);
    const udiff = Math.abs(upper - n);
    const lowDiff = Math.abs(n - lower);
    return  udiff > lowDiff ? lower : upper;
}

var utils = {

    renderToCanvas: function (width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        renderFunction(buffer.getContext('2d'));

        return buffer;
    },

    mapPoint: function(lat, lng, scale) {
        if(!scale){
            scale = 500;
        }
        var phi = (90 - lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;
        var x = scale * Math.sin(phi) * Math.cos(theta);
        var y = scale * Math.cos(phi);
        var z = scale * Math.sin(phi) * Math.sin(theta);
        return {x: x, y: y, z:z};
    },

  /* from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */

  hexToRgb: function(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  },

  createLabel:  function(text, size, color, font, underlineColor) {

      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.font = size + "pt " + font;

      var textWidth = context.measureText(text).width;
      canvas.width = isPowerOfTwo(textWidth) ? textWidth : nearestPowerOf2(textWidth, underlineColor);
      canvas.height = size + 14; 

      // better if canvases have even heights
      if(canvas.width % 2){
          canvas.width++;
      }
      if(canvas.height % 2){
          canvas.height++;
      }

      if(underlineColor){
          canvas.height += 30;
      }
      context.font = size + "pt " + font;

      context.textAlign = "center";
      context.textBaseline = "middle";

      context.strokeStyle = 'black';

      context.miterLimit = 2;
      context.lineJoin = 'circle';
      context.lineWidth = 6;

      context.strokeText(text, canvas.width / 2, canvas.height / 2);

      context.lineWidth = 2;

      context.fillStyle = color;
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      if(underlineColor){
          context.strokeStyle=underlineColor;
          context.lineWidth=4;
          context.beginPath();
          context.moveTo(0, canvas.height-10);
          context.lineTo(canvas.width-1, canvas.height-10);
          context.stroke();
      }

      return canvas;

  },

};

export default utils;
