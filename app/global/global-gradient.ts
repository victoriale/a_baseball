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
      colors.push(new Color(colorStrings[i]));
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
}