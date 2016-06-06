/**
 * Created by Victoria on 3/1/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {WidgetModule} from "../../modules/widget/widget.module";
import {ContactUsModule} from '../../modules/contactus/contactus.module';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import {GlobalSettings} from '../../global/global-settings';

declare var moment;
@Component({
    selector: 'contactus-page',
    templateUrl: './app/webpages/contactus-page/contactus.page.html',
    directives: [ContactUsModule, WidgetModule],
    providers: [],
})
export class ContactUsPage implements OnInit{
    //Object that builds contact us module
    public mailManUrl: string;
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
            imageURL: GlobalSettings.getSiteLogoUrl(),
            text1: 'Last Updated'+moment(new Date()).format('dddd MMMM Do, YYYY'),
            text2: ' United States',
            text3: 'Have a question about Home Run Loyal? Write us a message.',
            text4: '',
            icon: 'fa fa-map-marker',
            hasHover: false
        }
    };

    constructor(private http:Http) {
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    formSubmitted(form){
        //start the form url to mailer and prepare for all the options user has checked
        this.mailManUrl = GlobalSettings.getApiUrl() + '/mailer';
        var options = [];

        //run through each case and append it to the url note the component should catch if client did not fill our entire form
        for(var items in form){
          switch(items){
            case 'name':
            this.mailManUrl += '/'+form[items];//items should equal 'name' here but in case of any type of changes
            break;
            case 'email':
            this.mailManUrl += '/'+form[items];//items should equal 'email' here but in case of any type of changes
            break;
            case 'description':
            this.mailManUrl += '/'+ encodeURIComponent(form[items]);//items should equal 'description' here but in case of any type of changes
            break;
            default:
              if(form[items] !== null){
                options.push(items);
              }
            break;
          }
        }

        //join all the options that were checked with commas and append to end of mailManUrl
        var stringOptions = options.join(',');
        this.mailManUrl += '/'+stringOptions
        //send to backend the full mail url of all options
        this.http.get(this.mailManUrl,{})
    }

    ngOnInit(){

    }
}
