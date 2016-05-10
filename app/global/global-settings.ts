import {Injectable} from 'angular2/core';

@Injectable()

export class GlobalSettings {
  private static _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  private static _imageUrl: string = 'http://prod-sports-images.synapsys.us';
  /**
   * @returns the API domain
   */
  static getApiUrl(): string {
    return this._apiUrl;
  }

  static getImageUrl(relativePath): string{
    return this._imageUrl + relativePath;
  }
}
