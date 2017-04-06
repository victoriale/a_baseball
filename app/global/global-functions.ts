import {Injectable} from '@angular/core';
import {Link} from './global-interface';

declare var moment: any;

@Injectable()

export class GlobalFunctions {
    /**
     * Returns the approriate ordinal suffix for the given number
     *
     * @example
     * Suffix(1) => "st"
     *
     * @example
     * Suffix(10) => "th"
     *
     * @example
     * Suffix(23) => "rd"
     *
     * @param {number}
     * @returns: string
     */
    static Suffix(i: number): string {
      var a = i % 10,
        b = i % 100;
        if (a == 1 && b != 11) {
            return "st";
        }
        if (a == 2 && b != 12) {
            return "nd";
        }
        if (a == 3 && b != 13) {
            return "rd";
        }
        if (i == 0){
          return '';
        }
        return "th";
    };

    /**
     * - Converts the string to title case by capitalizing the first letter of
     * each word and lowercasing the rest of the word, where words are separated by whitespace characters.
     * - If the str is undefined or null, then it is returned without performing the conversion
     *
     * @param {string} str - The string value to convert to title case
     * @returns {string}
     */
     toTitleCase(str:string): string {
       if ( str === undefined || str === null ) {
         return str;
       }
       return str.replace(/\w\S*/g, function(txt) {
         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
       });
     };

     static toTitleCase(str:string): string { // the above can be removed once conversion is swapped to static
       if ( str === undefined || str === null ) {
         return str;
       }
       return str.replace(/\w\S*/g, function(txt) {
         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
       });
     };

    /**
     * - Transforms a USA phone number (7 or 10 character string) to a human readable format.
     * - If the string is not 7 or 10 characters long, it returns the string unchanged.
     * - If the val is undefined or null, then "N\A" is returned.
     *
     * @example
     * // "(123) 123-1234" (10 digits)
     * formatPhoneNumber("1231231234");
     *
     * @example
     * // "123-4567" (7 digits)
     * formatPhoneNumber("1234567");
     *
     * @example
     * // "1234" (4 digits);
     * formatPhoneNumber("1234");
     *
     * @example
     * // "12345678911"
     * formatPhoneNumber("12345678911");
     *
     * @param {string} val - The string or number to convert to a phone number
     */
    formatPhoneNumber(val:any): string {
      if ( val === undefined || val === null ) {
        return "N\A";
      }

      if(isNaN(val) === false) {
        val = val.toString();
      }

      var numberLength = val.length;
      if(numberLength === 10) {
          //Number with area code
          val = '(' + val.slice(0, 3) + ') ' + val.slice(3, 6) + '-' + val.slice(6, 10);
      } else if(numberLength === 7){
          //Number without area code
          val = val.slice(0, 3) + '-' + val.slice(3, 7);
      }

      return val;
    }

    /**
     * - Returns a comma-delimited string for the given value.
     * - If the value is undefined or null, then the def string is returned instead.
     *
     * @example
     * // returns "456"
     * commaSeparateNumber(456)
     *
     * @example
     * // returns "4,566"
     * commaSeparateNumber(4566)
     *
     * @example
     * // returns "124,566"
     * commaSeparateNumber(124566)
     *
     * @example
     * // returns "2,124,566"
     * commaSeparateNumber(2124566)
     *
     * @example
     * // returns ""
     * commaSeparateNumber(undefined)
     *
     * @example
     * // returns "N/A"
     * commaSeparateNumber(undefined, "N/A")
     *
     * @param {number} value - The value to convert to a comma-delimited number
     * @param {string} def - (Optional) The default string value to use if the value is undefined. If it's not included, then "" is used as the def string.
     * @returns {string}
     */
      static commaSeparateNumber(value:number, def?:string): string {
      if ( value === null || value === undefined ) {
        return def || "";
      }

      var parts = value.toString().split("."); //split on decimal point
      while (/(\d+)(\d{3})/.test(parts[0])){
          parts[0] = parts[0].replace(/(\d+)(\d{3})/, '$1'+','+'$2');
      }
      return parts.join(".");
    }

    /**
     * - Returns a comma-delimited currency string for the given value.
     * - If the value is 0, undefined, or null, then the def string is returned instead.
     *
     * @param {number} price - The value to convert to a currency string
     * @param {string} def - (Optional) The default string value to use if the number is 0 or undefined. If it's not included, then "N/A" is used as the def string.
     * @returns {string}
     */
    formatPriceNumber(value:number, def?:string): string {
      if ( def === null || def === undefined ) {
        def = "N\A";
      }

      if ( value === null || value === undefined || value === 0 ) {
        return def;
      }
      else {
        //TODO: support multiple currencies?
        return "$" + GlobalFunctions.commaSeparateNumber(value);
      }
    }

    /**
     * - Returns the full state name corresponding to the given postal code.
     * Only US states, DC, Puerto Rico, and Ontario (?) are supported.
     *
     * - If state is undefined or null. or if the state could not be found in the lookup
     * table, then state is returned unchanged.
     *
     * @param {string} state - The postal state code to convert to the full state name. Case does not matter.
     * @returns {string}
     */
    static fullstate(state:string): string {
        if ( state === undefined || state === null ) {
          return state;
        }
        var stateName = {
            AL: 'Alabama',
            AK: 'Alaska',
            AZ: 'Arizona',
            AR: 'Arkansas',
            CA: 'California',
            CO: 'Colorado',
            CT: 'Connecticut',
            DC: 'District of Columbia',
            DE: 'Delaware',
            FL: 'Florida',
            GA: 'Georgia',
            HI: 'Hawaii',
            ID: 'Idaho',
            IL: 'Illinois',
            IN: 'Indiana',
            IA: 'Iowa',
            KS: 'Kansas',
            KY: 'Kentucky',
            LA: 'Lousiana',
            ME: 'Maine',
            MD: 'Maryland',
            MA: 'Massachusetts',
            MI: 'Michigan',
            MN: 'Minnesota',
            MS: 'Mississippi',
            MO: 'Missouri',
            MT: 'Montana',
            NE: 'Nebraska',
            NV: 'Nevada',
            NH: 'New Hampshire',
            NJ: 'New Jersey',
            NM: 'New Mexico',
            NY: 'New York',
            NC: 'North Carolina',
            ND: 'North Dakota',
            OH: 'Ohio',
            OK: 'Oklahoma',
            ON: 'Ontario',
            OR: 'Oregon',
            PA: 'Pennsylvania',
            PR: 'Puerto Rico',
            RI: 'Rhode Island',
            SC: 'South Carolina',
            SD: 'South Dakota',
            TN: 'Tennessee',
            TX: 'Texas',
            UT: 'Utah',
            VT: 'Vermont',
            VA: 'Virginia',
            WA: 'Washington',
            WV: 'West Virginia',
            WI: 'Wisconsin',
            WY: 'Wyoming'
        };

        let upperState = state.toUpperCase();
        let displayState = stateName[upperState];
        return displayState !== undefined ? displayState : state;
    };


    /**
     * - Returns the full state name corresponding to the given postal code. Only US
     * states and DC are supported.
     * - If state is undefined or null. or if the state could not be found in the lookup
     * table, then state is returned unchanged.
     *
     * @param {string} state - The postal state code to convert to the AP Abbreviation. Case does not matter.
     * @returns {string}
     */

    static stateToAP(state: string): string {
        if ( state === undefined || state === null ) {
          return state;
        }

        var stateAP = {
            AL: 'Ala.',
            AK: 'Alaska',
            AZ: 'Ariz.',
            AR: 'Ark.',
            CA: 'Calif.',
            CO: 'Colo.',
            CT: 'Conn.',
            DE: 'Del.',
            DC: 'D.C.',
            FL: 'Fla.',
            GA: 'Ga.',
            HI: 'Hawaii',
            ID: 'Idaho',
            IL: 'Ill.',
            IN: 'Ind.',
            IA: 'Iowa',
            KS: 'Kan.',
            KY: 'Ky.',
            LA: 'La.',
            ME: 'Maine',
            MD: 'Md.',
            MA: 'Mass.',
            MI: 'Mich.',
            MN: 'Minn.',
            MS: 'Miss.',
            MO: 'Mo.',
            MT: 'Mont.',
            NE: 'Neb.',
            NV: 'Nev.',
            NH: 'N.H.',
            NJ: 'N.J.',
            NM: 'N.M.',
            NY: 'N.Y.',
            NC: 'N.C.',
            ND: 'N.D.',
            OH: 'Ohio',
            OK: 'Okla.',
            OR: 'Ore.',
            PA: 'Pa.',
            RI: 'R.I.',
            SC: 'S.C.',
            SD: 'S.D.',
            TN: 'Tenn.',
            TX: 'Texas',
            UT: 'Utah',
            VT: 'Vt.',
            VA: 'Va.',
            WA: 'Wash.',
            WV: 'W.Va.',
            WI: 'Wis.',
            WY: 'Wyo.'
        };

        let upperState = state.toUpperCase();
        let displayState = stateAP[upperState];
        return displayState !== undefined ? displayState : state;
    };

    /**
     * - Transforms camel case to regular case (Words split up and capitalized)
     * - If the str is undefined or null, then it is returned without performing the conversion
     *
     * @param {string} str - The str value to convert to regular case
     * @returns {string}
     */
    camelCaseToRegularCase(str:string): string {
        if ( str === undefined || str === null ) {
          return str;
        }
        return str
            .replace(/([A-Z][a-z]+)/g, " $1")
            .replace(/([A-Z][A-Z]+)/g, " $1")
            .replace(/([^A-Za-z ]+)/g, " $1")
            // uppercase the first character
            .replace(/^./, function(txt){ return txt.toUpperCase(); })
    };

    /**
     * - Transforms kabab cased strings to camel case.
     * - If the str is undefined or null, then it is returned without performing the conversion.
     *
     * @param {string} str - The str value to convert to camel case
     * @returns {string}
     */
    kababCaseToCamelCase(str:string): string {
        if ( str === undefined || str === null ) {
          return str;
        }
        str = str.replace(/-/g, ' ');
        str = this.toTitleCase(str);
        str = str.replace(/ /g, '');
        str = str[0].toLowerCase() + str.slice(1);
        return str;
    };

    /**
     * - Transforms camel-cased strings to lower-case kabab case.
     * - Used mainly for SEO friendly URL values.
     * - If the str is undefined or null, then it is returned without performing the conversion.
     *
     * @param {string} str - The str value to convert to kabab case
     * @returns {string}
     */
    camelCaseToKababCase(str:string): string {
        if ( str === undefined || str === null ) {
          return str;
        }
        str = str
            .replace(/([A-Z][a-z]+)/g, " $1")
            .replace(/([A-Z][A-Z]+)/g, " $1")
            .replace(/([^A-Za-z ]+)/g, " $1")
            .replace(/ /g, '-');
        //Lowercase entire string
        str = str.toLowerCase();
        return str;
    };

  /**
   * - Transforms strings to lower-case kabab case with hyphens and strips commas, periods, and single quotes.
   * - Used mainly for SEO friendly URL values.
   * - If the str is undefined or null, then it is returned without performing the conversion.
   *
   * @param {string} str - The str value to convert to kabab case
   * @returns {string}
   */
    static toLowerKebab(str:string):string{
        str = str.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[\.,']/g, '');
        return str;
    }

    /**
     * - Formats the date as 'dddd, MMMM D, YYYY'
     * - Appends the timestamp as 'hh:mm A' if {includeTimestamp} is true.
     *
     * @param {any} jsDate - the date to format; can be a string or a JavaScript Date
     * @param {boolean} includeTimestamp - (Optional) set to true to include a timestamp at the end
     * @param {string} timezone - (Optional) the timezone string to append if {includeTimestamp} is true
     * @returns {string} - formatted string
     */
    static formatUpdatedDate(jsDate:any, includeTimestamp?:boolean, timezone?:string): string {
      var date = moment(jsDate);
      var str = GlobalFunctions.formatGlobalDate(date,'dayOfWeek');
      if ( includeTimestamp ) {
        str = GlobalFunctions.formatGlobalDate(date,'timeZone');
      }
      return str;
    }

    /**
     * - Formats the date as 'dddd, MMMM D, YYYY'
     * - Appends the timestamp as 'hh:mm A' if {includeTimestamp} is true.
     *
     * @param {any} jsDate - the date to format; can be a string or a JavaScript Date
     * @param {string} beforeMonthFormat - the date format to use before the AP month
     * @param {string} afterMonthFormat - the date format to use after the AP month
     * @returns {string} - formatted string
     */
    static formatDateWithAPMonth(jsDate:any, beforeMonthFormat: string, afterMonthFormat: string): string {
      var date = moment(jsDate);
      var str = (beforeMonthFormat ? date.format(beforeMonthFormat) : "") +
                GlobalFunctions.formatAPMonth(date.month()) + " " +
                (afterMonthFormat ? date.format(afterMonthFormat) : "");
      return str;
    }

    //take parameters and convert using moment to subtract given number of days from it;

    static addSubtractWeek(unixDate, act , dayNum){
        if(act = "add"){
            moment(unixDate).add(dayNum, 'days').tz('America/New_York').format('YYYY-MM-DD');
        } else if(act = "subtract"){
            moment(unixDate).subtract(dayNum, 'days').tz('America/New_York').format('YYYY-MM-DD');
        }
    }

    //individual date elements

    static getDateElement(date,type){

        var getType = {
            'year'    : moment(date).tz('America/New_York').format('YYYY'), //2017
            'month'   : moment(date).tz('America/New_York').format('MMM'),  //apr
            'day'     : moment(date).tz('America/New_York').format('D'),    //04
            'weekDay' : moment(date).tz('America/New_York').format('ddd'),  //tur
            'fullDate': moment(date).tz('America/New_York').format('YYYY-MM-DD'), //2017-04-04
            'hour'    : moment(date).tz('America/New_York').format('h:mm'), //12:56
            'amPm'    : moment(date).tz('America/New_York').format('A'), //PM
            'hourTimeStamp': moment(date).tz('America/New_York').format('h:mm A z'), //12:56 PM
        }

        return getType[type];

    }

    static validMoment(dateString, dateFormat?){
        if(dateFormat && typeof dateFormat != "undefined"){
            return moment(dateString,dateFormat);

        }else{
            return moment(dateString);
        }
    }


    /*
      - Takes in a string, or a unix value, and converts it to either:
        -timeZone: Tuesday, Oct. 03, 2006 5:30:10PM (EDT)
        -dayOfWeek: Tuesday, Oct. 03, 2006
        -defaultDate: Oct. 03, 2006
        -shortDate: 10/03/06
        -time 5:30:10PM (EDT)

        If argument is Null/Undefined/Wrong, function defaults to today's date and throws a console log


    */

    static formatGlobalDate(value:any, identifier:string) {
      var unixValue;
      if(typeof value != 'undefined' && value != null){
        if(moment(value,'YYYY-MM-DD kk:mm:ss',true).isValid()){ // string parse (possible format)
          unixValue = moment(value,'YYYY-MM-DD kk:mm:ss',true).unix() * 1000;
        } else {
          unixValue = moment(value).unix() * 1000;
          if(unixValue.toString().length <= 10){
             unixValue = unixValue * 1000;
          }
        }
      } else { // if initial value is null, defaut to today's date.
        unixValue = moment(new Date()).unix() * 1000;
      }

      if(isNaN(unixValue) || unixValue == null || unixValue.toString().length <= 10 || unixValue.toString().match(/^[0-9]+$/) == null){ // Final Check
        console.log("Date Value is not defined - Defaulting to today's date - GlobalFunctions.formatGlobalDate()");
        unixValue = moment(new Date()).unix() * 1000;
      }
      var newDate;
      //setup common parameters
      var shortDay = moment(unixValue).format('D');
      var monthnum = Number(moment(unixValue).format('M')) - 1;
      var month = GlobalFunctions.formatAPMonth(monthnum);
      var year = moment(unixValue).format('YYYY');

      switch(identifier) {
        case 'defaultDate':
          newDate = month + ' ' + shortDay + ', ' + year; // Oct. 03, 2006
          return newDate;
        case 'shortDate':
          newDate = moment(unixValue).format('MM/DD/YY'); // 10/03/06
          return newDate;
        case 'timeZone':
          newDate = moment(unixValue).format('dddd') + ', ' + month + ' ' + shortDay + ', ' + year + ' ' + moment(unixValue).tz('America/New_York').format('hh:mmA (z)'); //Tuesday, Oct. 03, 2006 5:30:10PM (EDT)
          return newDate;
        case 'dayOfWeek':
          newDate = moment(unixValue).format('dddd') + ', ' + month + ' ' + shortDay + ', ' + year; //Tuesday, Oct. 03, 2006
          return newDate;
        case 'time':
          newDate = moment(unixValue).tz('America/New_York').format('hh:mmA (z)');
          return newDate;
        default:
          return month + ' ' + shortDay + ', ' + year;
      }
    }


  /**
   * Parses the date string with moment and returns it as a long-date formatted string
   * @param {string} dateStr
   * @returns MMMM d, YYYY
   */
  static formatLongDate(dateStr: string) {
    if (!dateStr) {
      return "N/A";
    }
    var date = moment(dateStr)
    if (!date) {
      return "N/A";
    }
    return GlobalFunctions.formatGlobalDate(date.month(),'defaultDate');
  }

  /**
   * Returns the English name of the month formatted in AP style
   *
   * @param {number} month - The month to format (0-based)
   * @returns
   */
   static formatAPMonth(month: number) {
      switch (month) {
        case 0: return "Jan.";
        case 1: return "Feb.";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "Aug.";
        case 8: return "Sept.";
        case 9: return "Oct.";
        case 10: return "Nov.";
        case 11: return "Dec.";
        default: return "";
      }
   }

  /**
   * Formats the given string as English words if it's between
   * 0 and 9. Otherwise the given string is returned unchanged.
   *
   * @param {number} num - The number to format
   * @returns
   */
   static formatNumber(num: number) {
    switch (num) {
      case 0: return "zero";
      case 1: return "one";
      case 2: return "two";
      case 3: return "three";
      case 4: return "four";
      case 5: return "five";
      case 6: return "six";
      case 7: return "seven";
      case 8: return "eight";
      case 9: return "nine";
      default: return num.toString();
    }
   }

  static setupAlphabeticalNavigation(pageType: string): Array<Link> {
    var navigationArray: Array<Link> = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    //Build alphabet array for navigation links
    for ( var i in alphabet ) {
        navigationArray.push({
            text: alphabet[i],
            route: ['Directory-page-starts-with',
              {
                  type: pageType,
                  page: 1,
                  startsWith: alphabet[i]
              }]
        });
    }
    return navigationArray;
  }


 /**
  * Create a valid value to set to routerLink by parsing a string delimited by a | pipe
  * -- creating an object for params when the object syntax is present in string
  * example input string: "Location-page|{‘loc’:'Industry-CA’}"
  */
  static parseToRoute(stringRoute) {
    if(stringRoute == null){ return ["Error-page"];}
    let stringRouteArr = stringRoute.split("|");

    let generatedUrl = stringRouteArr.map(function (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
      }
      return item;
    });
    return generatedUrl;
  }
/**
 * Format value to Billion/Million/Thousand
 */
  static nFormatter(num: number): string {
  	if (num >= 1000000000) {
  		return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  	}
  	if (num >= 1000000) {
  		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  	}
  	if (num >= 1000) {
  		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  	}
  	return num.toString();
  }
  /**
  * Get website host name
  */
  static getHostName(url: string): string {
      var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
      if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match[2];
      }
      else {
          return null;
      }
  }

  /**
   * Converts a given name to it's possessive version by checking to see if
   * the last character is an 's' or not. If it's an 's', then only an
   * apostrophe is added. Otherwise both an apostrophe and an 's' are added.
   *
   * If 'name' is null or empty, then it is returned unchanged.
   */
  static convertToPossessive(name: string) {
    if ( !name || name.length == 0 ) return name;

    var lastChar = name.charAt(name.length-1);
    return lastChar == 's' ? name + "'" : name + "'s";
  }
  static formatDate(date) {
    var month = moment.unix(date/1000).format("MMM.");
    var day = moment.unix(date/1000).format("DD");
    var year = moment.unix(date/1000).format("YYYY");
    var time = moment.unix(date/1000).format("h:mm");
    var a = moment.unix(date/1000).format("A");
    var zone = "(EST)"
    return {month: month, day: day, year: year, time: time, a: a, zone: zone}
  }
}
