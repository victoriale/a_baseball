/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable} from '@angular/core';
import {ArticleData} from "./global-interface";
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from './global-functions';
import {GlobalSettings} from './global-settings';
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router-deprecated";

@Injectable()

export class PartnerHeader {
  public protocolToUse: string = (location.protocol == "https:") ? "https" : "http";

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

    var fullUrl = GlobalSettings.getPartnerApiUrl(partner_id);

    // console.log(fullUrl);
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
