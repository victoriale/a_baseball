import {Injectable} from 'angular2/core';

@Injectable()

export class GlobalSettings {
  private static _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  private static _imageUrl: string = 'http://prod-sports-images.synapsys.us';
  private static _articleUrl: string = 'http://dev-homerunloyal-ai.synapsys.us/';
  private static _recommendUrl: string = 'http://dev-homerunloyal-ai.synapsys.us/headlines/event/';
  private static _headlineUrl: string = 'http://dev-homerunloyal-ai.synapsys.us/headlines/team/';
  /**
   * @returns the API domain
   */
  static getApiUrl(): string {
    return this._apiUrl;
  }

  static getImageUrl(relativePath): string{
    return this._imageUrl + relativePath;
  }

  static getArticleUrl(): string{
    return this._articleUrl;
  }

  static getRecommendUrl(): string{
    return this._recommendUrl;
  }

  static getHeadlineUrl(): string{
    return this._headlineUrl;
  }
}
