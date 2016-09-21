//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
  *Optimal Length for Search Engines
  *Roughly 155 Characters
***/
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

@Injectable()

export class SeoService {
  private titleService: Title;

  private headElement: HTMLElement;

  private metaDescription: HTMLElement;

  private ogTitle: HTMLElement;
  private ogType: HTMLElement;
  private ogUrl: HTMLElement;
  private ogImage: HTMLElement;
  private ogDesc: HTMLElement;

  private robots: HTMLElement;
  private DOM: any;

 /**
  * Inject the Angular 2 Title Service
  * @param titleService
  */
  constructor(titleService: Title){
    this.titleService = titleService;
    this.DOM = getDOM();

   /**
    * get the <head> Element
    * @type {any}
    */
    this.headElement = this.DOM.query('head');
    this.metaDescription = this.getOrCreateMetaElement('description');
    this.robots = this.getOrCreateMetaElement('robots');
    this.ogTitle = this.getOgMetaElement("og:title");
    this.ogType = this.getOgMetaElement("og:type");
    this.ogUrl = this.getOgMetaElement("og:url");
    this.ogImage = this.getOgMetaElement("og:image");
    this.ogDesc = this.getOgMetaElement("og:description");
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public getMetaDescription(): string {
    return this.metaDescription.getAttribute('content');
  }

  public setMetaDescription(description: string) {
    let html = description;
    let div = document.createElement("div");
    div.innerHTML = html;
    let truncatedDescription = div.textContent || div.innerText || "";
    if(truncatedDescription.length > 167){
      truncatedDescription = truncatedDescription.substring(0, 167);
      truncatedDescription += '...';
    }
    this.metaDescription.setAttribute('content', truncatedDescription);
    console.log(this.metaDescription);
  }

  public getMetaRobots(): string {
    return this.robots.getAttribute('content');
  }

  //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
  //http://www.robotstxt.org/meta.html
  public setMetaRobots(robots: string) {
    this.robots.setAttribute('content', robots);
  }

  public setOgTitle(newTitle: string) {
    this.ogTitle.setAttribute('content', newTitle);
  }
  public setOgType(newType: string) {
    this.ogType.setAttribute('content', newType);
  }
  public setOgUrl(url: string) {
    this.ogUrl.setAttribute('content', url);
  }
  public setOgImage(imageUrl: string) {
    this.ogImage.setAttribute('content', imageUrl);
  }
  public setOgDesc(description: string) {
    this.ogDesc.setAttribute('content', description);
  }

   /**
    * get the HTML Element when it is in the markup, or create it.
    * @param name
    * @returns {HTMLElement}
    */
    private getOrCreateMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.query('meta[name=' + name + ']');
      if (el === null) {
        el = this.DOM.createElement('meta');
        el.setAttribute('name', name);
        this.headElement.appendChild(el);
      }
      return el;
    }
    private getOgMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.query('meta[property="' + name + '"]');
      if (el === null) {
        el = this.DOM.createElement('meta');
        el.setAttribute('property', name);
        this.headElement.appendChild(el);
      }
      return el;
    }

}
