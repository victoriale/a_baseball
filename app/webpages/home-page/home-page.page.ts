import {Component, OnInit} from 'angular2/core';
import {FooterComponent} from "../../components/footer/footer.component";

@Component({
    selector: 'home-page',
    templateUrl: './app/webpages/home-page/home-page.page.html',
    directives: [FooterComponent],
    inputs: [],
    providers: [],
})
export class HomePage implements OnInit {
    ngOnInit() {
    }
}
