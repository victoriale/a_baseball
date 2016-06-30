import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class HeadlineDataService {

    constructor(public http:Http) {}

    getAiHeadlineData(teamID) {
        var fullUrl = GlobalSettings.getHeadlineUrl();
        return this.http.get(fullUrl + teamID)
            .map(res => res.json())
            .map(data => data);
    }
}