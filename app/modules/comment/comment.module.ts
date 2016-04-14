/**
 * Created by Victoria on 3/2/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {moduleHeader} from "../../components/module-header/module-header";

declare var DISQUS: any;

@Component({
    selector: 'comment-module',
    templateUrl: './app/modules/comment/comment.module.html',
    
    directives: [moduleHeader],
    providers: [],
})
export class CommentModule implements OnInit{
    module_title: string;

    ngOnInit(){
        var script = document.createElement("script");

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
                    js.src = "//myjoyfulhome.disqus.com/embed.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
              }(document, 'script', 'disqusJS'));

        document.body.appendChild(script);
        this.module_title = 'Share Your Comments With Us';
    }
}
