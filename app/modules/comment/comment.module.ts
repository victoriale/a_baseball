/**
 * Created by Victoria on 5/2/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

declare var DISQUS: any;

@Component({
    selector: 'comment-module',
    templateUrl: './app/modules/comment/comment.module.html',
    directives: [ModuleHeader],
    providers: [],
})
export class CommentModule implements OnInit{
    module_title: string;
    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Share Your Comments With Us",
      hasIcon: false,
      iconClass: ""
    };
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
