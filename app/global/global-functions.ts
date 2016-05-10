import {Injectable} from 'angular2/core';

declare var moment: any;

@Injectable()

export class GlobalFunctions {

    Suffix = function(i) {
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
    commaSeparateNumber(value:number, def?:string): string {
      if ( value === null || value === undefined ) {
        return def || "";
      }

      var parts = value.toString().split("."); //split on decimal point
      parts[0] = parts[0].replace(/(\d+)(\d{3})/g, "$1,$2"); //replace all groups of three
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
        return "$" + this.commaSeparateNumber(value);
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
    fullstate(state:string): string {
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
    stateToAP(state: string): string {
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
   * - Transforms  strings to lower-case kabab case (with hyphens).
   * - Used mainly for SEO friendly URL values.
   * - If the str is undefined or null, then it is returned without performing the conversion.
   *
   * @param {string} str - The str value to convert to kabab case
   * @returns {string}
   */
    static toLowerKebab(str:string):string{
        str = str.toLowerCase()
            .replace(/\s+/g, '-');
        return str;
    }

    /**
     * - Formats the date as 'dddd, MMMM Do, YYYY'
     * - Appends the timestamp as 'hh:mm A' if {includeTimestamp} is true.
     *
     * @param {Date} jsDate - the date to format
     * @param {boolean} includeTimestamp - (Optional) set to true to include a timestamp at the end
     * @param {string} timezone - (Optional) the timezone string to append if {includeTimestamp} is true
     * @returns {string} - formatted string
     */
    formatUpdatedDate(jsDate:Date, includeTimestamp?:boolean, timezone?:string): string {
      var date = moment(jsDate);
      var str = date.format('dddd, MMMM Do, YYYY');
      if ( includeTimestamp ) {
        str += ' | ' + date.format('hh:mm A') + (timezone !== undefined && timezone !== null ? timezone : "");
      }
      return str;
    }

    convertListName = function(val){
        var names = {
            'homesAtLeast5YearsOld': 'Homes at least 5 years old',
            'homes-at-least-5-years-old': 'Homes at least 5 years old',
            'homesLessThan5YearsOld': 'Homes less than 5 years old',
            'homes-less-than-5-years-old': 'Homes less than 5 years old',
            'homesWithSprinklerAndDeck': 'Homes with sprinkler and deck',
            'homes-with-sprinkler-and-deck': 'Homes with sprinkler and deck',
            'homesWithVaultedCeilingsAndSecuritySystem': 'Homes with vaulted ceiling and security system',
            'homes-with-vaulted-ceilings-and-security-system': 'Homes with vaulted ceiling and security system',
            'homesLargest': 'Largest homes',
            'homes-largest': 'Largest homes',
            'homesBrickLeastExpensive': 'Least expensive brick houses',
            'homes-brick-least-expensive': 'Least expensive brick houses',
            'homesLeastExpensive': 'Least expensive homes',
            'homes-least-expensive': 'Least expensive homes',
            'homesWithPoolLeastExpensive': 'Least expensive homes with a swimming pool',
            'homes-with-pool-least-expensive': 'Least expensive homes with a swimming pool',
            'homesWithWaterfrontLeastExpensive': 'Least expensive homes with waterfront',
            'homes-with-waterfront-least-expensive': 'Least expensive homes with waterfront',
            'homesWith2BedroomsMostExpensive': 'Most expensive 2 bedroom homes',
            'homes-with-2-bedrooms-most-expensive': 'Most expensive 2 bedroom homes',
            'homesWith3BedroomsMostExpensive': 'Most expensive 3 bedroom homes',
            'homes-with-3-bedrooms-most-expensive': 'Most expensive 3 bedroom homes',
            'homesMostExpensive': 'Most expensive homes',
            'homes-most-expensive': 'Most expensive homes',
            'homesNewTraditional': 'New traditional homes',
            'homes-new-traditional': 'New traditional homes',
            'listingsInWealthiestZipCode': 'Listings in wealthiest ZIP code in area',
            'listings-in-wealthiest-zipcode': 'Listings in wealthiest ZIP code in area',
            'listingsWithLongDescriptions': 'Listings with long descriptions',
            'listings-with-long-descriptions': 'Listings with long descriptions',
            'listingsWithMoreThan10Photos': 'Listings with more than 10 photos',
            'listings-with-more-than-10-photos': 'Listings with more than 10 photos',
            'listingsWithMoreThan5Photos': 'Listings with more than 5 photos',
            'listings-with-more-than-5-photos': 'Listings with more than 5 photos',
            'listingsWithVirtualTours': 'Listings with virtual tours',
            'listings-with-virtual-tours': 'Listings with virtual tours',
            'listingsMostRecent': 'Most recent listings',
            'listings-most-recent': 'Most recent listings',
            'condosMostExpensive': 'Most expensive condos',
            'condos-most-expensive': 'Most expensive condos'
        };

        return typeof names[val] === 'undefined' ? this.camelCaseToRegularCase(val) : names[val];
    }

    formatDaysOnMarket = function(daysOnMarket) {
        if ( daysOnMarket === null || daysOnMarket === undefined || daysOnMarket === "N/A" ) {
          return "N/A";
        }
        else {
          return moment().subtract(daysOnMarket, 'days').format('dddd, MMMM Do, YYYY');
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
    return date.format("MMMM d, YYYY");
  }

  /**
   * Formats the given string as English words if it's between
   * 0 and 9. Otherwise the given string is returned unchanged.
   *
   * @param {string} numStr - The number string to format
   * @returns
   */
  static formatNumber(numStr: string) {
   switch (numStr) {
     case "0": return "zero";
     case "1": return "one";
     case "2": return "two";
     case "3": return "three";
     case "4": return "four";
     case "5": return "five";
     case "6": return "six";
     case "7": return "seven";
     case "8": return "eight";
     case "9": return "nine";
     default: return numStr;
   }
  }
}
