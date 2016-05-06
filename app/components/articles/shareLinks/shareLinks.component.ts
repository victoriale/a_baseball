import {Component, OnInit, Input} from 'angular2/core';

@Component({
    selector: 'shareLinks-component',
    templateUrl: './app/components/articles/shareLinks/shareLinks.component.html',
    directives: [],
    inputs: ['url']
})

export class ShareLinksComponent implements OnInit {
    share:any;

    getLinks() {
        this.share = [
            {
                link: "https://pinterest.com/pin/create/button/?url=&media=",
                fontAwesome: "share-alt",
                color: "#5ab53f",
                right: "8px"
            },
            {
                link: "https://www.facebook.com/sharer/sharer.php?u=",
                fontAwesome: "facebook",
                color: "#3B5998",
                right: "8px"
            },
            {
                link: "https://twitter.com/home?status=",
                fontAwesome: "twitter",
                color: "#00ACED",
                right: "8px"
            },
            {
                link: "https://www.linkedin.com/shareArticle?mini=true&url=",
                fontAwesome: "linkedin",
                color: "#007BB5",
                right: "8px"
            },
            {
                link: "https://plus.google.com/share?url=",
                fontAwesome: "google-plus",
                color: "#DD4B39",
                right: "0px"
            }
        ];
    }

    ngOnInit() {
        this.getLinks();
    }
}