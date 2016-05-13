import {Injectable} from 'angular2/core';

@Injectable()

export class GlobalSettings {
  private static _env = window.location.hostname.split('.')[0];
  private static _proto = window.location.protocol;

  private static _apiUrl: string = '-homerunloyal-api.synapsys.us';
  private static _imageUrl: string = '-sports-images.synapsys.us';

  static getEnv(env:string): string{
    if( env == "localhost" ){
      env = "dev";
    }
    if( env != "dev" && env != "qa"){
      env = "prod";
    }
    return env;
  }

  static getApiUrl(): string {
    //[https:]//[prod]-homerunloyal-api.synapsys.us
    return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
  }

  static getImageUrl(relativePath): string{
    return this._proto + "//" + this.getEnv(this._env) + this._imageUrl + relativePath;
  }
}
