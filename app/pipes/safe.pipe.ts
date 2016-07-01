import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';

//sanitize html and innerHtml
@Pipe({
  name: 'safeHtml'
})
export class SanitizeHtml implements PipeTransform {
  constructor(private sanitizer:DomSanitizationService){}
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}


//sanitize scripts
@Pipe({
  name: 'safeScript'
})
export class SanitizeScript implements PipeTransform {
  constructor(private sanitizer:DomSanitizationService){}
  transform(script) {
    return this.sanitizer.bypassSecurityTrustScript(script);
  }
}


//sanitize styles
@Pipe({
  name: 'safeStyle'
})
export class SanitizeStyle implements PipeTransform {
  constructor(private sanitizer:DomSanitizationService){}
  transform(style) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}


//sanitize url src
@Pipe({
  name: 'safeUrl'
})
export class SanitizeUrl implements PipeTransform {
  constructor(private sanitizer:DomSanitizationService){}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}


//sanitize url that returns videos
@Pipe({
  name: 'safeRUrl'
})
export class SanitizeRUrl implements PipeTransform {
  constructor(private sanitizer:DomSanitizationService){}
  transform(rurl) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(rurl);
  }
}
