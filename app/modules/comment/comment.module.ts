/**
 * Created by Victoria on 5/2/2016.
 */
import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {MLBPageParameters} from '../../global/global-interface';

declare var DISQUS: any;

@Component({
    selector: 'comment-module',
    templateUrl: './app/modules/comment/comment.module.html',
    directives: [ModuleHeader],
    providers: [],
})
export class CommentModule implements OnInit, OnChanges {
    @Input() profileName: string;

    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Comments - [Profile Name]",
      hasIcon: false,
      iconClass: ""
    };

    ngOnChanges() {
        let profileName = this.profileName ? this.profileName : "[Profile Name]";
        this.headerInfo.moduleTitle = "Comments - " + profileName;
    }

    ngOnInit(){
        var script:any = document.createElement("script");

        // DisQus Plugin
        script.innerHTML = (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)){
                    DISQUS.reset({
                        reload: true,
                        config: function () {
                            this.page.identifier = (window.location.pathname + " ").replace("/"," ");
                            this.page.url = window.location.href + "#!newthread";
                        }
                    });
                }else{
                    js = d.createElement(s); js.id = id;
                    js.src = "//homerunloyal.disqus.com/embed.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
              }(document, 'script', 'disqusJS'));

        document.body.appendChild(script);
    }
}
