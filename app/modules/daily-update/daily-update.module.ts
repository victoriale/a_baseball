import {Component, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {CircleImageData} from "../../components/images/image-data";
import {CircleImage} from "../../components/images/circle-image";
import {GlobalSettings} from "../../global/global-settings";

@Component({
    selector: 'daily-update-module',
    templateUrl: './app/modules/daily-update/daily-update.module.html',
    directives: [ModuleHeader, CircleImage],
    providers: []
})

export class DailyUpdateModule{
    public displayData: Object;
    public backgroundImage: string;
    
    @Input() dailyUpdateDataArray: Array<Object>;
    @Input() profileName: string;
    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Daily Update - [Profile Name]",
      hasIcon: true,
      iconClass: null
    };

    sampleImage = "./app/public/no-image.png";

  public imageConfig: CircleImageData;


    constructor(){
    this.imageConfig = {
        imageClass: "image-121",
        mainImage: {
          imageClass: "border-2",
          imageUrl: GlobalSettings.getSiteLogoUrl(),
          placeholderImageUrl: GlobalSettings.getSiteLogoUrl()
        }
      };
    }

}
