class Color {
  red: number;
  green: number;
  blue: number;
  
  constructor(hexValue) {
    if ( /#(\w{6})/.exec(hexValue) ) {
      let hexOnly = (hexValue.charAt(0) == "#") ? hexValue.substring(1, 7) : hexValue;
      this.red   = parseInt(hexOnly.substring(0, 2), 16);
      this.green = parseInt(hexOnly.substring(2, 4), 16);
      this.blue  = parseInt(hexOnly.substring(4, 6), 16);
    }
  }
  
  toRgbFormat(alpha?: number) {
    if ( alpha ) {      
      return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + alpha + ")";
    }
    else {
      return "rgba(" + this.red + "," + this.green + "," + this.blue + ")";
    }
  }
}

export class Gradient {  
  static getGradientStyles(colorStrings: Array<string>, alpha?: number): any {  
    var colors: Array<Color> = [];
    for ( var i = 0; i < colorStrings.length; i++ ) {
      if ( colorStrings[i] != null ) {
        colors.push(new Color(colorStrings[i]));
      }
    }
    var numOfColors = colors.length;
    if ( numOfColors <= 1 ) {
      return null;
    }
    else {
      var currPercent = 0;
      var steps = 100/(numOfColors-1);
      var gradientSteps = [];
      for ( var i = 0; i < numOfColors; i++ ) {
        gradientSteps.push(colors[i].toRgbFormat(alpha) + " " + currPercent.toFixed(0) + "%");
        currPercent += steps;
      }
      var gradientStr = gradientSteps.join(",");
      return {
          '-ms-filter': "progid:DXImageTransform.Microsoft.gradient (0deg," + gradientStr + ")",
          'background': "linear-gradient(90deg," + gradientStr + ")"
      }  
    }
  }
  
  /**
   * This function calculates a weighted Euclidean distance for the 3-dimensional
   * space of red, green, and blue. This is not the best approximation for
   * color similarity as percieved by humans, but it is simple to calculate 
   * and hopefully is good enough for our purposes (avoiding blue+blue, red+red/orange matches).
   * 
   * For the algorithms see http://www.compuphase.com/cmetric.htm
   * 
   */
  static areColorsClose(colorStr1:string, colorStr2:string):boolean {
    var epsilon = 255;
    
    var squaredDiff = function(num1:number, num2:number):number {
      var temp = num1 - num2;
      return temp * temp;
    }
    
    var color1 = new Color(colorStr1);
    var color2 = new Color(colorStr2);
    
    //Weighted RGB Euclidian distance
    var sum = 3 * squaredDiff(color1.red, color2.red) + 4 * squaredDiff(color1.green, color2.green) + 2 * squaredDiff(color1.blue, color2.blue);    
    var distance = Math.abs(Math.sqrt(sum));
    
    // console.log("difference between " + colorStr1 + " and " + colorStr2 + " is " + distance);
        
    return distance < epsilon;
  }
  
  
}