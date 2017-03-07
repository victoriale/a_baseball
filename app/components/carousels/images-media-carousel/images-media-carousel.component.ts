import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizationService, SafeStyle} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {CircleButton} from "../../buttons/circle/circle.button";
import {ModuleHeader} from "../../module-header/module-header.component";
import {ModuleHeaderData} from "../../module-header/module-header.component";

declare var jQuery:any;

export interface MediaImageItem {
    id: number;
    image: string;
    copyData: string;
    title: string;
}

@Component({
    selector: 'images-media-carousel',
    templateUrl: './app/components/carousels/images-media-carousel/images-media-carousel.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        CircleButton,
        ModuleHeader
    ],
    providers: [],
    inputs: ['trending', 'mediaImages', 'featureListing', 'modalButton', 'imageData', 'copyright', "imageTitle", 'profHeader', 'isProfilePage'],
})

export class ImagesMedia implements OnInit {
    @Input() imageData:string;
    @Input() copyright:string;
    @Input() imageTitle:string;
    @Input() isProfilePage:boolean;

    expand:boolean;

    expandText:string = 'Expand';
    expandIcon:string = 'fa-expand';
    modalButton:boolean = false;

    mediaImages:Array<MediaImageItem>;
    // smallImage: MediaImageItem;

    smallObjCounter:number = 0;
    backgroundImage:SafeStyle;
    totalImageCount:number = 0;
    imageCounter:number = 0;
    imagesTitle:string = "Images";
    image_url = './app/public/no_photo_images/onError.png';
    images:any;
    displayCounter:number;
    imageCredit:string;
    description:string;
    profHeader:any;
    arraySize:number = 5;
    modHeadData:ModuleHeaderData;

    constructor(private _sanitizer:DomSanitizationService) {
    }

    modalExpand() {
        if (this.expand == true) {
            this.expand = false;
            jQuery("body").css({"overflow": "auto", "pointer-events": "auto"});
        } else {
            this.expand = true;
            jQuery("body").css({"overflow": "hidden", "pointer-events": "none"});
        }
        return this.expand;
    }

    left() {
        //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
        this.imageCounter = (((this.imageCounter - 1) % this.imageData.length) + this.imageData.length) % this.imageData.length;
        this.smallObjCounter = (((this.smallObjCounter - 1) % this.arraySize) + this.arraySize) % this.arraySize;
        if (this.smallObjCounter == 4) {
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle, false);
        }
        //run the changeMain function to change the main image once a new array has been established
        this.changeMain(this.imageCounter);
    }

    right() {
        this.imageCounter = (this.imageCounter + 1) % this.imageData.length;
        this.smallObjCounter = (this.smallObjCounter + 1) % this.arraySize;
        if (this.smallObjCounter == 0) {
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle);
        }
        //run the changeMain function to change the main image once a new array has been established
        this.changeMain(this.imageCounter);
    }

    //this is where the angular2 decides what is the main image
    changeMain(num) {
        this.displayCounter = this.imageCounter + 1;
        // this.smallImage = this.mediaImages;
        if (this.mediaImages && this.smallObjCounter < this.mediaImages.length) {
            this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + this.mediaImages[this.smallObjCounter].image + "?width=640)");
            this.imageCredit = this.mediaImages[this.smallObjCounter].copyData;
            this.description = this.mediaImages[this.smallObjCounter].title;
        }
    }

    changeClick(num) {
        this.imageCounter = this.mediaImages[num % 5].id;
        this.smallObjCounter = num % 5;
        this.changeMain(this.imageCounter);
    }

    modifyMedia(images, copyright, imageTitle, forward = true):Array<MediaImageItem> {
        if (this.modalButton) {//just so the carousel knows that the expand button is
            this.expandText = 'Collapse';
            this.expandIcon = 'fa-compress';
        }
        var totalImgs = images.length;
        if (totalImgs < 5) {
            this.arraySize = totalImgs;
        }
        var newImageArray = [];
        var arrayStart = (((this.imageCounter + (forward ? 0 : -4)) % totalImgs) + totalImgs) % totalImgs;
        for (var i = arrayStart; i < arrayStart + this.arraySize; i++) {
            var index = i % totalImgs;
            if (typeof this.copyright != 'undefined' && typeof this.imageTitle != 'undefined') {
                newImageArray.push({
                    id: index,
                    image: images[index],
                    backgroundImage: this._sanitizer.bypassSecurityTrustStyle("url(" + images[index] + "?width=125&quality=90)"),
                    copyData: copyright[index],
                    title: imageTitle[index]
                });
            } else {
                newImageArray.push({id: index, image: images[index]});
            }
        }
        return newImageArray;
    }

    //makes sure to show first image and run the modifyMedia function once data has been established
    ngOnChanges(event) {
        if (typeof this.imageData != 'undefined') {
            //if data coming from module to variable mediaImages changes in what way then reset to first image and rerun function
            this.smallObjCounter = 0;
            this.imageCounter = 0;
            if (this.copyright == 'undefined') {
                this.copyright = '';
            }
            if (this.imageTitle == 'undefined') {
                this.imageTitle = '';
            }
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle);
            this.changeMain(0);
            this.totalImageCount = this.imageData.length;
            if (this.isProfilePage) {
                this.modHeadData = {
                    moduleTitle: "Images &amp; Media - " + this.profHeader.profileName,
                    hasIcon: false,
                    iconClass: '',
                };
            }
        }
    }

    ngOnInit() {}
}
