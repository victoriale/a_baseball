import {Component, OnInit, Input} from '@angular/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {CircleImage} from '../../components/images/circle-image';
//Import needed interfaces
import {ModuleHeaderData} from '../../components/module-header/module-header.component';
import {CircleImageData} from '../../components/images/image-data';

export interface ShareModuleInput{
    //Image url used for the image component
    imageUrl: string;
    //Optional - Title of module
    //Default is 'Share This Profile With Your Friends'
    moduleTitle?: string;
    //Optional - Text inside module
    //Default is 'Share this Profile Below'
    shareText?: string;
}

@Component({
    selector: 'share-module',
    templateUrl: './app/modules/share/share.module.html',
    directives: [ModuleHeader, CircleImage],
    providers: []
})

export class ShareModule implements OnInit{
    @Input() shareModuleInput: ShareModuleInput;
    public moduleHeaderData: ModuleHeaderData = {
        moduleTitle: 'Share This Profile With Your Friends',
        hasIcon: false,
        iconClass: ''
    };
    public imageData: CircleImageData = {
        imageClass: "image-174",
        mainImage: {
            imageUrl: '',
            hoverText: "Sample",
            imageClass: "border-3"
        }
    };
    public shareText: string = 'Share This Profile Below:';
    public shareButtons: Array<{
        class: string;
        icon: string;
        text: string;
        url: string;
        }> = [
            {
                class: 'facebook',
                icon: 'fa-facebook',
                text: 'Share on Facebook',
                url: 'https://www.facebook.com/sharer/sharer.php?u='
            },
            {
                class: 'twitter',
                icon: 'fa-twitter',
                text: 'Share on Twitter',
                url: 'https://twitter.com/home?status='
            },
            {
                class: 'google',
                icon: 'fa-google-plus',
                text: 'Share on Google +',
                url: 'https://plus.google.com/share?url='
            },
            {
                class: 'pinterest',
                icon: 'fa-pinterest',
                text: 'Share on Pinterest',
                url: 'https://pinterest.com/pin/create/button/?url='
            }
        ];

    //Function to configure buttons and components
    configureModule(){
        var input = this.shareModuleInput;
        var currentUrl = window.location.href;
        var shareButtons = this.shareButtons;

        //If input is undefined, exit function
        if(typeof input === 'undefined'){
            return false;
        }
        //Set custom module title if it exists
        if(typeof input.moduleTitle !== 'undefined'){
            this.moduleHeaderData.moduleTitle = input.moduleTitle;
        }
        //Set custom share text if it exists
        if(typeof input.shareText !== 'undefined'){
            this.shareText = input.shareText;
        }
        //Set image url
        this.imageData.mainImage.imageUrl = input.imageUrl;

        //Complete Url of share button
        this.shareButtons.map(function(item){
            switch(item.class){
                case 'pinterest':
                    item.url += currentUrl + '&media=' + input.imageUrl;
                    break;
                default:
                    item.url += currentUrl;
                    break;
            }
            return item;
        })
    }

    ngOnInit(){
        this.configureModule();
    }
}
