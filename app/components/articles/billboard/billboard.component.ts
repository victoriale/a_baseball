import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'billboard-component',
    templateUrl: './app/components/articles/billboard/billboard.component.html',
    inputs: ["teamId"],
})

export class BillboardComponent implements OnInit{
  dangerousBillBoardUrl: string;

  safeBillBoardUrl: SafeResourceUrl;

  constructor(private _sanitizer: DomSanitizationService) {
  }

  ngOnInit(){
    this.dangerousBillBoardUrl = "http://devapi.synapsys.us/widgets/sports/ai_billboard.html?%7B%22team%22%3A%22"+this.teamId+"%22%2C%22remn%22%3A%22true%22%7D"
    this.safeBillBoardUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.dangerousBillBoardUrl);
  }
}
