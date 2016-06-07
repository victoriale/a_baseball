class Color {
  red: number;
  green: number;
  blue: number;
  
  static parseColor(hexValue) {
    if ( hexValue != null ) {
      var match = /#?([0-9A-Fa-f]{6})/.exec(hexValue); 
      if ( match && match[1] ) {
        let hexOnly = match[1];
        var red   = parseInt(hexOnly.substring(0, 2), 16);
        var green = parseInt(hexOnly.substring(2, 4), 16);
        var blue  = parseInt(hexOnly.substring(4, 6), 16);
        return new Color(red, green, blue);
      }
    }
    return null;
  }
  
  static decimalToHex(d:number, padding:number) {
    var hex = Number(d).toString(16);
    if ( padding != null ) padding = 2;
    while(hex.length < padding ) {
      hex = "0" + hex;
    }
    return hex;
  }
  
  constructor(red: number, green: number, blue: number) {
    this.red = parseInt(red.toString());
    this.green = parseInt(green.toString());
    this.blue = parseInt(blue.toString());
  }
  
  toRgbFormat(alpha?: number) {
    if ( alpha != null ) {      
      return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + alpha + ")";
    }
    else {
      return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }
  }
  
  toHexFormat() {
    return "#" + Color.decimalToHex(this.red, 2) + Color.decimalToHex(this.green, 2) + Color.decimalToHex(this.blue, 2);
  }
  
  adjust(adjustColor: number) {
    return new Color(this.red * adjustColor, this.green * adjustColor, this.blue * adjustColor);
  }
}

export class Gradient {  
  static getGradientStyles(colorStrings: Array<string>, alpha?: number): any {  
    var colors: Array<Color> = [];
    for ( var i = 0; i < colorStrings.length; i++ ) {
      var color = Color.parseColor(colorStrings[i]);
      if ( color != null ) {
        colors.push(color);
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
    
    var color1 = Color.parseColor(colorStr1);
    var color2 = Color.parseColor(colorStr2);
    
    //Weighted RGB Euclidian distance
    var sum = 3 * squaredDiff(color1.red, color2.red) + 4 * squaredDiff(color1.green, color2.green) + 2 * squaredDiff(color1.blue, color2.blue);    
    var distance = Math.abs(Math.sqrt(sum));
    
    // console.log("difference between " + colorStr1 + " and " + colorStr2 + " is " + distance);
        
    return distance < epsilon;
  }
  
  /**
   * Finds a pair of colors that are distinct, given the two sets of color arrays. 
   * Throws an exception if there is not at least one color in each array.
   * 
   * @returns a string array of the resulting pair of colors. [0] is a color from the first set and [1] is a color from the second set.
   */
  static getColorPair(colorSetOne: Array<string>, colorSetTwo: Array<string>) {
    if ( !colorSetOne || colorSetOne.length == 0 ) {
      throw new Error("Invalid colorSetOne - it must contain a least one string");
    }    
    if ( !colorSetTwo || colorSetTwo.length == 0 ) {
      throw new Error("Invalid colorSetTwo - it must contain a least one string");
    }    
    var colorOne = colorSetOne[0];
    var colorTwo = colorSetTwo[0]
    if ( Gradient.areColorsClose(colorOne, colorTwo) ) {
      if ( colorSetTwo.length >= 2) {
        colorTwo = colorSetTwo[1];
      } else if ( colorSetOne.length >=2 ) {
        colorOne = colorSetOne[1];
      }
      else {
        //darken
        colorTwo = Color.parseColor(colorSetTwo[0]).adjust(.5).toHexFormat();
      }
    }  
    return [colorOne, colorTwo];  
  } 
  
}