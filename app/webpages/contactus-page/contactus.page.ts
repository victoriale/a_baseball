/**
 * Created by Victoria on 3/1/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {AuHeaderComponent} from '../../components/au-header/au-header.component';

declare var jQuery: any;

@Component({
    selector: 'Contactus-page',
    templateUrl: './app/webpages/contactus-page/contactus.page.html',
    
    directives: [BackTabComponent, TitleComponent, AuHeaderComponent, WidgetModule],
    providers: [],
})

export class ContactUsPage implements OnInit{
    //PLACEHOLDERS
    full_name = "John Smith";
    email = "email@domain.com";
    text_area = "Detailed description of your question here...";
    title_data: {};
    submissionform: any;
    auHeaderTitle = "Contact Us";

    constructor() {
    // Scroll page to top to fix routerLink bug
    window.scrollTo(0, 0);
  }

    getData(){
        //Contact us data
        this.title_data = {
            imageURL : '/app/public/joyfulhome_house.png',
            smallText1 : 'Last Updated: Friday, February 26, 2016',
            smallText2 : ' United States of America',
            heading1 : 'Contact Us',
            heading2 : '',
            heading3 : 'Help Us, Help You Faster.',
            heading4 : '',
            icon: 'fa fa-map-marker',
            hasHover: false
        };
    }

    formSubmit(){
      if(jQuery(".ff-fullname").val() == "")
      {
        alert("Please Fill in your name.");
        return false;
      }
      if(jQuery(".ff-email").val() == "")
      {
        alert("Please enter in an email.");
        return false;
      }
      if(jQuery(".ff-textfield").val() == "")
      {
        alert("Please enter in your message.");
        return false;
      }
      return true;
    }

    ngOnInit(){
        this.getData();
    }
}
