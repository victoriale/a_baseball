/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {List, List2} from './global-interface';
import {Injectable} from 'angular2/core';
import {HomePageData, ArticleData} from "./global-interface";
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from './global-functions';
import {Observable} from "rxjs/Observable";
import {Router} from "angular2/router";

@Injectable()

export class PartnerHeader {
  public protocolToUse: string = (location.protocol == "https:") ? "https" : "http";
  public apiUrl: string = '://dev-real-api.synapsys.us/listhuv/?action=get_partner_data&domain=';

  constructor(public http: Http) {

  }

  //API for listing profile
  getPartnerData(partner_id) {

    // var partnerID = partner_id.split('-');
    //
    // //handles some cases where domain registries are different
    // var combinedID = [];
    // var domainRegisters = [];
    // for(var i = 0; i < partnerID.length; i++){
    //     if(partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co"){
    //       combinedID.push(partnerID[i]);
    //     }else{
    //       domainRegisters.push(partnerID[i]);
    //     }
    // }
    //
    // partner_id = domainRegisters.join('-')+ "." + combinedID.join('.');

    var fullUrl = this.protocolToUse + this.apiUrl + partner_id;
    return this.http.get(fullUrl, {
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return data;
      }
    )
  }
}

@Injectable()

export class DynamicWidgetCall {
  public apiUrl: string = "http://108.170.11.234:190/list_creator_api.php";

  constructor(public http: Http) { }
  //Function to set custom headers

  // Method to get data for the list for the dynamic widget
  getWidgetData(tw, sw, input) {
    // Inputs: tw - trigger word, sw - sort parameter, input - input value
    // If value is not needed, pass -1

    // Return error if no tw
    // if (typeof (tw) == "undefined") {
    //   return {
    //     "success": false,
    //     "message": "Error: Trigger word is required"
    //   };
    // }

    // Set defaults
    if (typeof (sw) == "undefined") {
      sw = -1;
    }
    if (typeof (input) == "undefined") {
      input = -1;
    }

    // Build the URL
    var url = this.apiUrl + "?tw=" + tw + "&sw=" + sw + "&input=" + input;

    // Build a key for logging
    var key = tw + ":" + sw + ":" + input;

    // Options array (unzip gzip response)
    var opts = {
      npmRequestOptions: {
        gzip: true
      }
    };

    return this.http.get(url, {
    })
      .map(
      res => res.json()
      )
      .map(
      data => {
        return data;
      },
      err =>{
        return err;
      }
  )
  }
}

@Injectable()
export class Articles {
  getArticles() {
    var articleData:ArticleData[] = [
      {
        metaData: [{
          homeTeamId: "123",
          awayTeamId: "321",
          league: "MLB",
          homeTeamName: "New York Yankees",
          awayTeamName: "Boston Red Sox",
          homeRecord: "5 - 1",
          awayRecord: "1 - 5",
          gameAlignment: "home",
          startDateTime: "04/15/2016 1900",
          hex: {
            homeColor: "#1F2F6B",
            awayColor: "#C91B34",
          },
          logos: {
            home: "http://www.sports-logos-screensavers.com/user/New_York_Yankees.jpg",
            away: "http://fullhdpictures.com/download.php?file=http://fullhdpictures.com/wp-content/uploads/2015/10/Boston-Red-Sox.jpg",
          },
        }],
        preGameReport: [{
          status: true,
          photos: {
            url: "http://cdnph.upi.com/sv/b/upi/UPI-5051455995474/2016/1/c904f0af00b25a07ef7e2cd01254c521/New-York-Yankees-spring-preview-Stronger-bullpen-may-bring-improvement.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp1",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        midGameReport: [{
          status: false,
          photos: {
            url: "http://cdnph.upi.com/sv/b/upi/UPI-5051455995474/2016/1/c904f0af00b25a07ef7e2cd01254c521/New-York-Yankees-spring-preview-Stronger-bullpen-may-bring-improvement.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp2",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        inningReport3: [{
          status: false,
          photos: {
            url: "http://cdn.fansided.com/wp-content/blogs.dir/210/files/2016/01/michael-pineda-joe-girardi-mlb-houston-astros-new-york-yankees.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp4",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        inningReport5: [{
          status: false,
          photos: {
            url: "http://i.dailymail.co.uk/i/pix/2013/05/21/article-2328496-19DBA433000005DC-706_634x422.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp5",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        inningReport7: [{
          status: false,
          photos: {
            url: "http://cache1.asset-cache.net/gc/53074243-jason-giambi-of-the-new-york-yankees-trots-gettyimages.jpg?v=1&c=IWSAsset&k=2&d=OCUJ5gVf7YdJQI2Xhkc2QKfUIsRBDCcqaXHe8w9%2F3FvMyTbEX5b21y78kGNqIsuqUv%2Bv66%2BRtSCW8fXRdj2j4g%3D%3D",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp6",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        postGameReport: [{
          status: false,
          photos: {
            url: "http://www2.pictures.zimbio.com/gi/New+York+Yankees+v+Detroit+Tigers+IXsXuIsMZLpl.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the Articles Module. derp3",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        aboutTheTeams: [{
          photos: {
            url: "https://static.rukkus.com/images/performer/headshots/boston-red-sox-tickets.jpg.870x570_q70_crop-smart_upscale.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy1",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        historicalTeamStats: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy2",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        lastMatchUp: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy3",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        startingLineUp: [{
          photos: {
            url: "http://cache3.asset-cache.net/gc/469610884-sandy-leon-of-the-boston-red-sox-hits-a-gettyimages.jpg?v=1&c=IWSAsset&k=2&d=GkZZ8bf5zL1ZiijUmxa7QXBMYnM2zdtNPeqNvPaxfQ93pvbZ2hWWYvIihUR9EEE%2BYxzI4%2F%2Fo6lldtpsYkaPTZBbJmLN2EvlXdihBIdHZ8S8%3D",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side of the Articles Module. derpy4",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        outfieldLF: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp1",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        outfieldCF: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp2",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        outfieldRF: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp3",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infield3B: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp4",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infieldSS: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp5",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infield2B: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp6",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        infield1B: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp7",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        pitcher: [{
          photos: {
            url: "http://media.gettyimages.com/photos/david-ortiz-of-the-boston-red-sox-watches-the-flight-of-the-ball-the-picture-id85854086",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp8",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        catcher: [{
          photos: {
            url: "http://images.forbes.com/media/lists/33/2010/boston-red-sox.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the right side. derpderp9",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        homeTeamInjuryReport: [{
          photos: {
            url: "http://cdnph.upi.com/sv/b/upi/UPI-2661459398773/2016/1/81809bbfda40ce0ca319c6e00ff42d8f/New-York-Yankees-Andrew-Miller-fractures-wrist.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy5",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        awayTeamInjuryReport: [{
          photos: {
            url: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Red_Sox_094_Jacoby_Ellsbury.jpg/680px-Red_Sox_094_Jacoby_Ellsbury.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy6",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        homeTeamStartingLineUp: [{
          photos: {
            url: "https://elyriact.smugmug.com/Sports/Pro-baseball/Indians-April-9-2013/i-R4cPgct/0/M/Yankees_Indians_Baseball__ctnews@chroniclet.com_6-M.jpg",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy7",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
        awayTeamStartingLineUp: [{
          photos: {
            url: "http://media.gettyimages.com/photos/kevin-millar-of-the-boston-red-sox-swings-at-a-new-york-yankees-pitch-picture-id52989440",
            index: "1",
          },
          date: "Tuesday, April 12 2016",
          headline: "This is the title for the left side of the Articles Module. derpy8",
          content: [
            "Herp derpsum sherpus serp derpy herpem ler me ner merp derps perp? Perp nerpy merp herpem derperker pee sherlamer serp dee. Serp ter herderder derpsum le. Der sherp dee derpler herpderpsmer ler terp. Ter mer perp derperker terpus sherper tee, derpler ner. Ler merpus herpderpsmer der herderder perp sherp. Dee derperker der derpus berp herpy herpderpsmer mer serp? Derpus der serp herderder. Terp dee ter der merp, herpsum mer serp le. Herderder herpy herpem berp perp nerpy berps terpus pee derp! Ter mer serp sherlamer, derpsum merpus sherp. Derpsum tee terpus dee, serp mer. Merp me herpler derpus herpsum derpy der perp derp merpus. Dee herpem derpsum der terp sherp ter ler berp herpy. Nerpy herpem derpus derps. Derpler terp perp pee? Herderder herpderpsmer tee derpy pee perp, ler ner terpus.",
            "Derpus sherpus der serp ner terp ter! Ner herpler merpus pee derp der merp terpus herpsum tee. Ner ler sherper merpus pee sherp berp. Ner ler merp herpderpsmer herp perp terp tee berps derp. Derpler herp sherp, pee ler sherpus mer herpler serp. Me derpsum nerpy mer ner derperker pee. Terp herpy herderder, herpler le pee berp. Herpler herpem mer ter derps tee berp. Der dee merpus herp perp terpus berp ter? Ner der derpsum ter derpy mer derpler nerpy terp perp? Nerpy pee terpus perper derpy ner! Tee le perper terpus herpderpsmer pee. Perp herp berp nerpy, mer herpsum ter me tee. Sherlamer berps ter me pee herpem derpler dee?",
            "Dee perper, herderder herpem herp derp sherper der herpler. Herpderpsmer le derp merpus sherpus terp sherper sherlamer ter. Derpus herp herpderpsmer ner derp merpus der perp. Mer herp pee ner. Derpsum pee herderder derpler, serp sherlamer mer der herpderpsmer le. Tee herpem dee derpsum derps sherlamer ter. Ter me tee berp le derpsum terp der ner. Serp perp berps terpus herpy! Ler der, sherlamer ter derperker perper. Derpus herderder pee der ler. Sherpus merpus le merp herderder, terp perper. Perp tee herpler pee der derp sherpus, dee terp? Sherp sherpus derp herpler dee perper merp der! Terp derps perp, berps derpy. Merp ner sherper ler. Merp ter derpsum herderder pee perper perp. Le herpem serp berp herpderpsmer der berps terp.",
            "Herpderpsmer tee derps derpsum ter derp herpsum terp merp? Ler dee, derp terpus mer herpler sherlamer berps! Le perp, der serp berp. Derpy merpus, pee derps mer herpem merp? Mer pee berps herpsum le derpsum, sherp ter perper derps. Tee derpus me merp derpler. Derperker merpus tee derpus sherper merp der. Derpler ler terp herpler pee herpem. Ner herp mer sherp. Herpsum derpus berp ter le derperker sherper perp terp derps. Perper derpsum sherlamer pee. Nerpy derp me ter. Le merp derp ter.",
            "Ter merp der, derpler terpus perp herp. Pee der terpus herpy. Sherlamer nerpy terp pee ler der ter ner berps. Pee derpy derps me sherlamer perp der. Sherp mer ter derperker pee sherlamer nerpy, le perp. Herpy derpler pee mer der herderder merp herpler. Ner derpus dee terp berps, sherp merp perp merpus herp. Me derps, herpem derp ler. Perp herpderpsmer sherpus perper. Derpler derpy sherlamer tee terp derpsum sherpus ner serp. Ter pee me perp sherpus mer le sherper sherlamer merp! Derpus ter terp, sherper derperker. Terp dee derpus le derperker. Merpus ler sherp me berp herpler pee sherper. Terp tee ter merp. Herpderpsmer le berp pee derp merpus dee. Le dee derp tee. Sherp sherlamer derpy derp me terpus. Serp sherper ler me herpler herpy, tee herpem. Merp me terp derpy le der."
          ]
        }],
      }
    ];
    return Promise.resolve(articleData);
  }
}
