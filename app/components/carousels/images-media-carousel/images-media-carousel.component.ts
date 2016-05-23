import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CircleButton} from "../../buttons/circle/circle.button";
import {ModuleHeader} from "../../module-header/module-header.component";
import {ModuleHeaderData} from "../../module-header/module-header.component";

declare var jQuery:any;

@Component({
    selector: 'images-media-carousel',
    templateUrl: './app/components/carousels/images-media-carousel/images-media-carousel.component.html',
    directives: [ROUTER_DIRECTIVES, CircleButton, ModuleHeader],
    providers: [],
    inputs: ['trending', 'mediaImages', 'featureListing', 'modalButton', 'imageData', 'copyright', 'profHeader', 'isProfilePage'],
    outputs: ['leftCircle', 'rightCircle', 'expand'],
})

export class ImagesMedia implements OnInit {
    @Input() imageData:any;
    @Input() copyright:any;
    @Input() isProfilePage:boolean;
    leftCircle:EventEmitter<boolean> = new EventEmitter();
    rightCircle:EventEmitter<boolean> = new EventEmitter();
    expand:any = new EventEmitter();
    expandText:string = 'Expand';
    expandIcon:string = 'fa-expand';
    modalButton:boolean = false;
    mediaImages:any;//need to create interface
    smallImage:any;
    smallObjCounter:number = 0;
    largeImage:string;
    totalImageCount:number = 0;
    imageCounter:number = 0;
    imagesTitle:string = "Images";
    image_url = './app/public/no_photo_images/onError.png';
    images:any;
    displayCounter:number;
    imageCredit:any;
    profHeader:any;
    modHeadData: Object;
    profileHeaderData: any;

    modalExpand() {
        if (this.expand) {
            this.expand = false;
        } else {
            this.expand = true;
        }
        return this.expand;
    }

    left() {
        //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
        this.imageCounter = (((this.imageCounter - 1) % this.imageData.length) + this.imageData.length) % this.imageData.length;
        this.smallObjCounter = (((this.smallObjCounter - 1) % 5) + 5) % 5;
        if (this.smallObjCounter == 4) {
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, false);
        }
        //run the changeMain function to change the main image once a new array has been established
        this.changeMain(this.imageCounter);
    }

    right() {
        //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
        this.imageCounter = (this.imageCounter + 1) % this.imageData.length;
        this.smallObjCounter = (this.smallObjCounter + 1) % 5;
        if (this.smallObjCounter == 0) {
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright);
        }
        //run the changeMain function to change the main image once a new array has been established
        this.changeMain(this.imageCounter);
    }

    //this is where the angular2 decides what is the main image
    changeMain(num) {
        this.displayCounter = this.imageCounter + 1;
        this.smallImage = this.mediaImages;
        this.largeImage = this.mediaImages[this.smallObjCounter].image;
        this.imageCredit = this.mediaImages[this.smallObjCounter].copyData;
    }

    changeClick(num) {
        this.imageCounter = this.mediaImages[num % 5].id;
        this.smallObjCounter = num % 5;
        this.changeMain(this.imageCounter);
    }

    modifyMedia(images, copyright, forward = true) {
        if (this.modalButton) {//just so the carousel knows that the expand button is
            this.expandText = 'Collapse';
            this.expandIcon = 'fa-compress';
        }
        var totalImgs = images.length;
        var newImageArray = [];
        var arrayStart = (((this.imageCounter + (forward ? 0 : -4)) % totalImgs) + totalImgs) % totalImgs;
        for (var i = arrayStart; i < arrayStart + 5; i++) {
            var index = i % totalImgs;
            if (typeof this.copyright != 'undefined') {
                newImageArray.push({id: index, image: images[index], copyData: copyright[index]});
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
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright);
            this.changeMain(0);
            this.totalImageCount = this.imageData.length;
            if (this.isProfilePage) {
                this.modHeadData = {
                    moduleTitle: "Images & Media - " + this.profHeader.profileName,
                    hasIcon: false,
                    iconClass: '',
                };
            }
        }
    }

    ngOnInit() {
    }
}
