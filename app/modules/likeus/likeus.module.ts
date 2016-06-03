/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit} from '@angular/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

@Component({
    selector: 'like-us-module',
    templateUrl: './app/modules/likeus/likeus.module.html',

    directives: [ModuleHeader],
})
export class LikeUs implements OnInit{
      moduleTitle: ModuleHeaderData = {
        moduleTitle: "Like Home Run Loyal on Facebook",
        hasIcon: false,
        iconClass: ""
      };
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
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6";
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
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
          `
        }
        document.body.appendChild(script);
    }
}
