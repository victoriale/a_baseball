/**
 * Created by Victoria on 3/7/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {moduleHeader} from "../../components/module-header/module-header";

@Component({
    selector: 'like-us-module',
    templateUrl: './app/modules/likeus/likeus.module.html',
    
    directives: [moduleHeader],
})
export class LikeUs implements OnInit{
    module_title: string;
    ngOnInit(){
        let FB = window['FB'];
        
        var script = document.createElement("script");
        if ( FB !== undefined && FB !== null ) {
          window['FB'] = undefined; //remove FB element
          
          //cjprieb: Beginning of the script removes the existing FB <script> element if it exists
          // so that it can be re-added and therefore reloaded.
          script.innerHTML =`
              (function(d, s, id) { 
                var fbs = d.getElementById(id);
                if (fbs) {
                  fbs.parentNode.removeChild(fbs); 
                }
                
                var js, fjs = d.getElementsByTagName(s)[0];
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
          `
        }
        else {
          script.innerHTML =`
              (function(d, s, id) {            
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
          `
        }
        document.body.appendChild(script);
        this.module_title = 'Like JoyfulHome on Facebook';
    }
}