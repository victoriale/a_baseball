//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
 *Optimal Length for Search Engines
 *Roughly 155 Characters
 ***/
import { Injectable, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import { DOCUMENT } from '@angular/platform-browser';
import { GlobalSettings } from "./global/global-settings";

@Injectable()

export class SeoService {
    private document:any;
    private headElement:HTMLElement;
    private metaDescription:HTMLElement;
    private themeColor:HTMLElement;
    private ogTitle:HTMLElement;
    private ogType:HTMLElement;
    private ogUrl:HTMLElement;
    private ogImage:HTMLElement;
    private ogDesc:HTMLElement;
    private startDate:HTMLElement;
    private endDate:HTMLElement;
    private isArticle:HTMLElement;
    //Elastic Search meta tags
    private es_page_type:HTMLElement;
    private es_data_source:HTMLElement;
    private es_article_id:HTMLElement;
    private es_page_title:HTMLElement;
    private es_category:HTMLElement;
    private es_published_date:HTMLElement;
    private es_article_author:HTMLElement;
    private es_article_publisher:HTMLElement;
    private es_image_url:HTMLElement;
    private es_description:HTMLElement;
    private es_page_url:HTMLElement;
    private es_article_type:HTMLElement;
    private es_keywords:HTMLElement;
    private DOM:any;
    robots:HTMLElement;

    constructor(@Inject(DOCUMENT) document:any) {
        this.DOM = getDOM();
        this.document = document;
        this.headElement = this.document.head;
    }

    //sets title to less than 55 characters and will choose the  first 3 words and append site name at end
    public setTitle(newTitle:string) {
        let splitTitle = newTitle.split(' ');
        let shortTitle;

        if (newTitle.length > 55) {
            splitTitle = splitTitle.splice(0, 3);
            shortTitle = splitTitle.join(' ');
        } else {
            shortTitle = splitTitle.join(' ');
        }
        shortTitle = shortTitle + ' | ' + GlobalSettings.getPageTitle();
        this.document.title = shortTitle;
    }

    public setMetaDescription(description:string) {
        if (SeoService.checkData(description)) {
            let html = description;
            let div = document.createElement("div");
            div.innerHTML = html;
            let truncatedDescription = div.textContent || div.innerText || "";
            if (truncatedDescription.length > 167) {
                truncatedDescription = truncatedDescription.substring(0, 167);
                truncatedDescription += '...';
            }
            if (!this.document.querySelector('meta[name="description"]')) {
                this.metaDescription = this.getOrCreateElement('name', 'description', 'meta');
            }
            this.setElementAttribute(this.metaDescription, 'content', truncatedDescription);
        }
    }

    //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
    //http://www.robotstxt.org/meta.html
    public setMetaRobots(robots:string) {
        if (SeoService.checkData(robots)) {
            if (!this.document.querySelector('meta[name="robots"]')) {
                this.robots = this.getOrCreateElement('name', 'robots', 'meta');
            }
            this.setElementAttribute(this.robots, 'content', robots);
        }
    }

    public setThemeColor(color:string) {
        if (SeoService.checkData(color)) {
            if (!this.document.querySelector('meta[name="themeColor"]')) {
                this.themeColor = this.getOrCreateElement('name', 'themeColor', 'meta');
            }
            this.setElementAttribute(this.themeColor, 'content', color);
        }
    }

    public setOgTitle(newTitle:string) {
        if (SeoService.checkData(newTitle)) {
            if (!this.document.querySelector('meta[property="og:title"]')) {
                this.ogTitle = this.getOrCreateElement('property', 'og:title', 'meta');
            }
            this.setElementAttribute(this.ogTitle, 'content', newTitle);
        }
    }

    public setOgDesc(description:string) {
        if (SeoService.checkData(description)) {
            if (!this.document.querySelector('meta[property="og:description"]')) {
                this.ogDesc = this.getOrCreateElement('property', 'og:description', 'meta');
            }
            this.setElementAttribute(this.ogDesc, 'content', description);
        }
    }

    public setOgType(newType:string) {
        if (SeoService.checkData(newType)) {
            if (!this.document.querySelector('meta[property="og:type"]')) {
                this.ogType = this.getOrCreateElement('property', 'og:type', 'meta');
            }
            this.setElementAttribute(this.ogType, 'content', newType);
        }
    }

    public setOgUrl(url:string) {
        if (SeoService.checkData(url)) {
            if (!this.document.querySelector('meta[property="og:url"]')) {
                this.ogUrl = this.getOrCreateElement('property', 'og:url', 'meta');
            }
            this.setElementAttribute(this.ogUrl, 'content', url)
        }
    }

    public setOgImage(imageUrl:string) {
        if (SeoService.checkData(imageUrl)) {
            if (!this.document.querySelector('meta[property="og:image"]')) {
                this.ogImage = this.getOrCreateElement('property', 'og:image', 'meta');
            }
            this.setElementAttribute(this.ogImage, 'content', imageUrl);
        }
    }

    public setCategory(category:string) {
        if (SeoService.checkData(category)) {
            if (!this.document.querySelector('meta[name="es_category"]')) {
                this.es_category = this.getOrCreateElement('name', 'es_category', 'meta');
            }
            this.setElementAttribute(this.es_category, 'content', category);
        }
    }

    public setStartDate(startDate:string) {
        if (SeoService.checkData(startDate)) {
            if (!this.document.querySelector('meta[name="start_date"]')) {
                this.startDate = this.getOrCreateElement('name', 'start_date', 'meta');
            }
            this.setElementAttribute(this.startDate, 'content', startDate);
        }
    }

    public setEndDate(endDate:string) {
        if (SeoService.checkData(endDate)) {
            if (!this.document.querySelector('meta[name="end_date"]')) {
                this.endDate = this.getOrCreateElement('name', 'end_date', 'meta');
            }
            this.setElementAttribute(this.endDate, 'content', endDate);
        }
    }

    public setIsArticle(isArticle:string) {
        if (SeoService.checkData(isArticle)) {
            if (!this.document.querySelector('meta[name="is_article"]')) {
                this.isArticle = this.getOrCreateElement('name', 'is_article', 'meta');
            }
            this.setElementAttribute(this.isArticle, 'content', isArticle);
        }
    }

    public setSearchType(searchType:string) {
        if (SeoService.checkData(searchType)) {
            if (!this.document.querySelector('meta[name="es_page_type"]')) {
                this.es_page_type = this.getOrCreateElement('name', 'es_page_type', 'meta');
            }
            this.setElementAttribute(this.es_page_type, 'content', searchType);
        }
    }

    public setArticleId(articleId:string) {
        if (SeoService.checkData(articleId)) {
            if (!this.document.querySelector('meta[name="es_article_id"]')) {
                this.es_article_id = this.getOrCreateElement('name', 'es_article_id', 'meta');
            }
            this.setElementAttribute(this.es_article_id, 'content', articleId);
        }
    }

    public setPageTitle(pageTitle:string) {
        if (SeoService.checkData(pageTitle)) {
            if (!this.document.querySelector('meta[name="es_page_title"]')) {
                this.es_page_title = this.getOrCreateElement('name', 'es_page_title', 'meta');
            }
            this.setElementAttribute(this.es_page_title, 'content', pageTitle);
        }
    }

    public setAuthor(author:string) {
        if (SeoService.checkData(author)) {
            if (!this.document.querySelector('meta[name="es_article_author"]')) {
                this.es_article_author = this.getOrCreateElement('name', 'es_article_author', 'meta');
            }
            this.setElementAttribute(this.es_article_author, 'content', author);
        }
    }

    public setPublisher(publisher:string) {
        if (SeoService.checkData(publisher)) {
            if (!this.document.querySelector('meta[name="es_article_publisher"]')) {
                this.es_article_publisher = this.getOrCreateElement('name', 'es_article_publisher', 'meta');
            }
            this.setElementAttribute(this.es_article_publisher, 'content', publisher);
        }
    }

    public setPageUrl(url:string) {
        if (SeoService.checkData(url)) {
            if (!this.document.querySelector('meta[name="es_page_url"]')) {
                this.es_page_url = this.getOrCreateElement('name', 'es_page_url', 'meta');
            }
            this.setElementAttribute(this.es_page_url, 'content', url);
        }
    }

    public setKeywords(searchString:string) {
        if (SeoService.checkData(searchString)) {
            if (!this.document.querySelector('meta[name="es_keywords"]')) {
                this.es_keywords = this.getOrCreateElement('name', 'es_keywords', 'meta');
            }
            this.setElementAttribute(this.es_keywords, 'content', searchString);
        }
    }

    public setSource(source:string) {
        if (SeoService.checkData(source)) {
            if (!this.document.querySelector('meta[name="es_data_source"]')) {
                this.es_data_source = this.getOrCreateElement('name', 'es_data_source', 'meta');
            }
            this.setElementAttribute(this.es_data_source, 'content', source);
        }
    }

    public setPublishedDate(publishedDate:string) {
        if (SeoService.checkData(publishedDate)) {
            if (!this.document.querySelector('meta[name="es_published_date"]')) {
                this.es_published_date = this.getOrCreateElement('name', 'es_published_date', 'meta');
            }
            this.setElementAttribute(this.es_published_date, 'content', publishedDate);
        }
    }

    public setImageUrl(imageUrl:string) {
        if (SeoService.checkData(imageUrl)) {
            if (!this.document.querySelector('meta[name="es_image_url"]')) {
                this.es_image_url = this.getOrCreateElement('name', 'es_image_url', 'meta');
            }
            this.setElementAttribute(this.es_image_url, 'content', imageUrl);
        }
    }

    public setPageDescription(articleTeaser:string) {
        if (SeoService.checkData(articleTeaser)) {
            if (!this.document.querySelector('meta[name="es_description"]')) {
                this.es_description = this.getOrCreateElement('name', 'es_description', 'meta');
            }
            this.setElementAttribute(this.es_description, 'content', articleTeaser);
        }
    }

    public setArticleType(articleType:string) {
        var metaTag = this.document.querySelector('meta[name="es_article_type"]');
        if (SeoService.checkData(articleType)) {
            if (!metaTag) {
                this.es_article_type = this.getOrCreateElement('name', 'es_article_type', 'meta');
            }
            this.setElementAttribute(this.es_article_type, 'content', articleType);
        }
    }

    /**
     * get the HTML Element when it is in the markup, or create it.
     * @param name
     * @returns {HTMLElement}
     */

    private getOrCreateElement(name:string, attr:string, type:string):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.createElement(type);
        this.setElementAttribute(el, name, attr);
        if (attr != "canonical") {
            this.setElementAttribute(el, "rel", "hrl");
        }
        this.DOM.insertBefore(this.document.head.lastChild, el);
        return el;
    }

    private setElementAttribute(el:HTMLElement, name:string, attr:string) {
        return this.DOM.setAttribute(el, name, attr);
    }

    public setCanonicalLink(RouteParams, router):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.query("link[rel='canonical']");
        let canonicalLink = window.location.href;
        if (el === null) {
            el = this.DOM.createElement('link');
            el.setAttribute('rel', 'canonical');
            el.setAttribute('href', canonicalLink);
            this.headElement.appendChild(el);
        } else {
            el.setAttribute('href', canonicalLink);
        }
        return el;
    }

    public removeMetaTags() {
        var element = this.document.getElementsByTagName('meta'), index;
        for (index = element.length - 1; index >= 0; index--) {
            if (element[index].getAttribute('rel') == 'hrl') {
                element[index].parentNode.removeChild(element[index]);
            }
        }
    }

    static checkData(data) {
        var check;
        check = !!(data != null && data != "");
        return check
    }
}
