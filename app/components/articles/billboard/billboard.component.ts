import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'billboard-component',
    templateUrl: './app/components/articles/billboard/billboard.component.html'
})

export class BillboardComponent implements OnInit {
    dangerousBillBoardUrl:string;

    safeBillBoardUrl:SafeResourceUrl;

    @Input() partnerId;
    @Input() teamId;

    constructor(private _sanitizer:DomSanitizationService) {
    }

    ngOnInit() {
        if (this.partnerId == null) {
            this.dangerousBillBoardUrl = "http://w1.synapsys.us/widgets/sports/ai_billboard.html?%7B%22team%22%3A%22" + this.teamId + "%22%2C%22remn%22%3A%22true%22%7D"
        } else {
            this.dangerousBillBoardUrl = "http://w1.synapsys.us/widgets/sports/ai_billboard.html?%7B%22team%22%3A%22" + this.teamId + "%22%2C%22remn%22%3A%22false%22%2C%22dom%22%3A%22" + this.partnerId + "%22%7D"
        }
        this.safeBillBoardUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.dangerousBillBoardUrl);
    }
}