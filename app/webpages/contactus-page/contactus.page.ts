/**
 * Created by Victoria on 3/1/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {WidgetModule} from "../../modules/widget/widget.module";
import {ContactUsModule} from '../../modules/contactus/contactus.module';

@Component({
    selector: 'contactus-page',
    templateUrl: './app/webpages/contactus-page/contactus.page.html',
    directives: [ContactUsModule, WidgetModule],
    providers: [],
})

export class ContactUsPage implements OnInit{
    //Object that builds contact us module
    public contactusInput: Object = {
        subjects: [
            {
                value: 'General Feedback',
                id: 'general'
            },
            {
                value: 'Advertisement',
                id: 'advertisement'
            },
            {
                value: 'Copyright Infringement',
                id: 'copyright'
            },
            {
                value: 'Inquire about partnering with Home Run Loyal',
                id: 'inquire'
            }
        ],
        titleData: {
            imageURL: '/app/public/mainLogo.png',
            smallText1: 'Last Updated: Monday, March 21, 2016',
            smallText2: ' United States',
            heading1: 'Have a question about Home Run Loyal? Write us a message.',
            heading2: '',
            heading3: '',
            heading4: '',
            icon: 'fa fa-map-marker',
            hasHover: false
        }
    };

    constructor() {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    formSubmitted(event){
        console.log('form submitted', event);
    }

    ngOnInit(){

    }
}
