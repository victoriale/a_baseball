import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { GlobalFunctions } from "../global/global-functions";
import { Gradient } from "../global/global-gradient";
import { MLBGlobalFunctions } from "../global/mlb-global-functions";

declare var moment;

@Injectable()
export class ArticleDataService {

    constructor(public http:Http) {
    }

    //AI article data processing
    getArticle(eventID, eventType, partnerId, rawType) {
        var fullUrl = GlobalSettings.getArticleUrl();
        return this.http.get(fullUrl + "articles?articleType=" + eventType + '&event=' + eventID + "&partner=" + partnerId + "&scope=mlb&readyToPublish=all")
            .map(res => res.json())
            .map(data => ArticleDataService.formatArticleData(data, rawType, eventID));
    }

    static formatArticleData(data, eventType, eventId) {
        if (data['data'].length > 0) {
            var hasEventID = true;
            var hasImages = true;
            var carouselImages;
            let articleType = ArticleDataService.getArticleType(eventType);
            var date = data['data'][0]['article_data'].last_updated ? data['data'][0]['article_data'].last_updated : data['data'][0]['article_data'].publication_date;
            ArticleDataService.parseLinks(data['data'][0]['article_data']['route_config'], data['data'][0]['article_data']['article']);
            if (data['data'][0]['article_data']['images'] != null) {
                carouselImages = ArticleDataService.getCarouselImages(data['data'][0]['article_data']['images'], articleType);
                hasImages = false;
            }
            return {
                eventID: eventId,
                hasEventId: hasEventID,
                articleType: articleType[1],
                articleSubType: articleType[2],
                isSmall: window.innerWidth < 640,
                rawUrl: window.location.href,
                pageIndex: articleType[0],
                title: data['data'][0]['article_data'].title,
                date: GlobalFunctions.formatGlobalDate(date * 1000, "timeZone"),
                articleContent: data['data'][0]['article_data'],
                teamId: (data['data'][0].team_id != null) ?
                    data['data'][0].team_id : data['data'][0]['article_data']['metadata'].team_id,
                images: carouselImages,
                imageLinks: ArticleDataService.getImageLinks(data['data'][0]['article_data'], articleType[1]),
                hasImages: hasImages,
                teaser: data['data'][0].teaser
            }
        }
    }

    static getCarouselImages(data, articleType) {
        var images = [];
        var imageArray = [];
        var copyArray = [];
        var titleArray = [];
        if (articleType == "game-module" || articleType == "team-record") {
            images = data['home_images'].concat(data['away_images']);
        } else if (articleType == "playerRoster") {
            images = data['home_images'];
        } else {
            images = data['away_images'];
        }
        data.sort(function () {
            return 0.5 - Math.random()
        });
        data.forEach(function (val, index) {
            if (!~val.image_url.indexOf('stock_images')) {
                imageArray.push(MLBGlobalFunctions.getBackroundImageUrlWithStockFallback(val['image_url'], 1)); //1 is a flag for carousel image
                copyArray.push(val['image_copyright']);
                titleArray.push(val['image_title']);
            } else if (~val.image_url.indexOf('stock_images') && index == 0) {
                imageArray.push(MLBGlobalFunctions.getBackroundImageUrlWithStockFallback(val['image_url'], 1)); //1 is a flag for carousel image
                copyArray.push(val['image_copyright']);
                titleArray.push(val['image_title']);
            }
        });
        return {
            imageData: imageArray ? imageArray : null,
            copyright: imageArray ? copyArray : null,
            imageTitle: imageArray ? titleArray : null,
            hasImages: true
        }
    }

    static getImageLinks(data, articleType) {
        switch (articleType) {
            case "playerRoster":
                return ArticleDataService.processLinks(data['article'], 'player_roster_module', 'roster');
            case "playerComparison":
                return ArticleDataService.processLinks(data['article'][2]['player_comparison_module'], 'player_comparison_module', 'compare');
            case "teamRecord":
                return ArticleDataService.processLinks(data['article'], 'team_record_module', 'teamRecord');
            case "game_module":
                return ArticleDataService.processLinks(data['article'], 'game_module', 'game_module');
        }
    }

    static getProfileImages(routeArray, url, size) {
        return {
            imageClass: size,
            mainImage: {
                imageUrl: url,
                urlRouteArray: routeArray,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-logo"
            }
        };
    }

    static processLinks(imageData, dataType, type) {
        var isFirstTeam = true;
        var imageLinkArray = [];
        imageData.forEach(function (val, index) {
            if (type == 'roster') {
                if (val[dataType]) {
                    var routeArray = MLBGlobalFunctions.formatPlayerRoute(val[dataType].team_name, val[dataType].name, val[dataType].id);
                    var url = GlobalSettings.getImageUrl(val[dataType]['headshot'], GlobalSettings._imgMdLogo);
                    val['image1'] = ArticleDataService.getProfileImages(routeArray, url, "image-122");
                    val['image2'] = ArticleDataService.getProfileImages(routeArray, url, "image-71");
                    imageLinkArray.push(val['image1'], val['image2']);
                }
            }
            if (type == 'compare' || type == 'teamRecord' || type == 'game_module') {
                let topCondition = (type == 'compare') ? index == 0 : (type == 'teamRecord') ? val[dataType] && isFirstTeam : index == 1 && val[dataType];
                let bottomCondition = (type == 'compare') ? index == 1 : (type == 'teamRecord') ? val[dataType] && !isFirstTeam : index == 4 && val[dataType];
                if (topCondition) {
                    if (type == 'compare' || type == 'teamRecord') {
                        if (type == 'compare') {
                            var routeArray = MLBGlobalFunctions.formatPlayerRoute(val.team_name, val.name, val.id);
                            var url = GlobalSettings.getImageUrl(val['headshot'], GlobalSettings._imgMdLogo);
                        } else if (type == 'teamRecord') {
                            var routeArray = MLBGlobalFunctions.formatTeamRoute(val[dataType].name, val[dataType].id);
                            var url = GlobalSettings.getImageUrl(val[dataType].logo, GlobalSettings._imgMdLogo);
                        }
                        val['image1'] = ArticleDataService.getProfileImages(routeArray, url, "image-122");
                        val['image2'] = ArticleDataService.getProfileImages(routeArray, url, "image-71");
                        imageLinkArray.push(val['image1'], val['image2']);
                        isFirstTeam = false;
                    } else {
                        var shortDate = val[dataType].event_date.substr(val[dataType].event_date.indexOf(",") + 1);
                        var urlTeamLeftTop = MLBGlobalFunctions.formatTeamRoute(val[dataType].home_team_name, val[dataType].home_team_id);
                        var urlTeamRightTop = MLBGlobalFunctions.formatTeamRoute(val[dataType].away_team_name, val[dataType].away_team_id);
                        var homeUrl = GlobalSettings.getImageUrl(val[dataType].home_team_logo, GlobalSettings._imgMdLogo);
                        var awayUrl = GlobalSettings.getImageUrl(val[dataType].away_team_logo, GlobalSettings._imgMdLogo);
                        val['image1'] = ArticleDataService.getProfileImages(urlTeamLeftTop, homeUrl, "image-122");
                        val['image2'] = ArticleDataService.getProfileImages(urlTeamRightTop, awayUrl, "image-122");
                        val['image3'] = ArticleDataService.getProfileImages(urlTeamLeftTop, homeUrl, "image-71");
                        val['image4'] = ArticleDataService.getProfileImages(urlTeamRightTop, awayUrl, "image-71");
                        imageLinkArray.push(val['image1'], val['image2'], val['image3'], val['image4'], shortDate);
                    }
                }
                if (bottomCondition) {
                    if (type == 'compare' || type == 'teamRecord') {
                        if (type == 'compare') {
                            var routeArray = MLBGlobalFunctions.formatPlayerRoute(val.team_name, val.name, val.id);
                            var url = GlobalSettings.getImageUrl(val['headshot'], GlobalSettings._imgMdLogo);
                        } else {
                            var routeArray = MLBGlobalFunctions.formatTeamRoute(val[dataType].name, val[dataType].id);
                            var url = GlobalSettings.getImageUrl(val[dataType].logo, GlobalSettings._imgMdLogo);
                        }
                        val['image3'] = ArticleDataService.getProfileImages(routeArray, url, "image-122");
                        val['image4'] = ArticleDataService.getProfileImages(routeArray, url, "image-71");
                        imageLinkArray.push(val['image3'], val['image4']);
                    } else {
                        var shortDate = val[dataType].event_date.substr(val[dataType].event_date.indexOf(",") + 1);
                        var urlTeamLeftBottom = MLBGlobalFunctions.formatTeamRoute(val[dataType].home_team_name, val[dataType].home_team_id);
                        var urlTeamRightBottom = MLBGlobalFunctions.formatTeamRoute(val[dataType].away_team_name, val[dataType].away_team_id);
                        var homeUrl = GlobalSettings.getImageUrl(val[dataType].home_team_logo, GlobalSettings._imgMdLogo);
                        var awayUrl = GlobalSettings.getImageUrl(val[dataType].away_team_logo, GlobalSettings._imgMdLogo);
                        val['image1'] = ArticleDataService.getProfileImages(urlTeamLeftBottom, homeUrl, "image-122");
                        val['image2'] = ArticleDataService.getProfileImages(urlTeamRightBottom, awayUrl, "image-122");
                        val['image3'] = ArticleDataService.getProfileImages(urlTeamLeftBottom, homeUrl, "image-71");
                        val['image4'] = ArticleDataService.getProfileImages(urlTeamRightBottom, awayUrl, "image-71");
                        imageLinkArray.push(val['image1'], val['image2'], val['image3'], val['image4'], shortDate);
                    }
                }
            }
        });
        return imageLinkArray
    }

    static complexArraySetup(arrayData, type):any {
        if (type == 'empty') {
            return [{text: "empty"}]
        } else if (type == 'basic') {
            return [{text: arrayData}, {text: "<br><br>", class: "line-break"}]
        } else if (type == 'route') {
            return [arrayData.length == 3 ? {text: arrayData[2],} : '', {text: arrayData[0], route: arrayData[1]}]
        }
    }

    static parseLinks(routeData, articleData) {
        var placeHolder = null;
        var routes;
        var fullRoutes = [];
        var newParagraph = [];
        var paragraph;
        var complexArray = [];
        var routeList = [];
        if (routeData) {
            routeData.forEach(function (val) {
                routes = {
                    index: val['paragraph_index'],
                    name: val.display,
                    route: val['route_type'] == "hoops_team" ? MLBGlobalFunctions.formatTeamRoute(val.display, val.id) : MLBGlobalFunctions.formatPlayerRoute(val.team_name, val.display, val.id),
                    searchParameter: "<ng2-route>" + val.display + "<\s*/?ng2-route>",
                };
                fullRoutes.push(routes);
            });
            routeList = fullRoutes;
        } else {
            routeList = [];
        }
        articleData.forEach(function (val, index) {
            if (typeof val != "object") {
                if (val == "") {
                    complexArray = ArticleDataService.complexArraySetup(null, 'empty');
                    articleData[index] = newParagraph.concat(complexArray);
                } else {
                    complexArray = ArticleDataService.complexArraySetup(val, 'basic');
                    articleData[index] = complexArray;
                    for (var i = 0; i < routeList.length; i++) {
                        if (index == routeList[i].index) {
                            var stringSearch = new RegExp(routeList[i].searchParameter);
                            if (placeHolder == null) {
                                paragraph = val;
                            } else {
                                paragraph = placeHolder;
                            }
                            if (paragraph.split(stringSearch)[1]) {
                                if (paragraph.split(stringSearch)[0] != "") {
                                    complexArray = ArticleDataService.complexArraySetup([routeList[i].name, routeList[i].route, paragraph.split(stringSearch)[0]], 'route');
                                } else {
                                    complexArray = ArticleDataService.complexArraySetup([routeList[i].name, routeList[i].route], 'route');
                                }
                                placeHolder = paragraph.split(stringSearch)[1];
                                newParagraph = newParagraph.concat(complexArray);
                                if (i == routeList.length - 1) {
                                    complexArray = ArticleDataService.complexArraySetup(placeHolder, 'basic');
                                    articleData[index] = newParagraph.concat(complexArray);
                                    newParagraph = [];
                                    placeHolder = null;
                                }
                            } else if (i == routeList.length - 1) {
                                complexArray = ArticleDataService.complexArraySetup(placeHolder, 'basic');
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            } else {
                                complexArray = ArticleDataService.complexArraySetup(placeHolder, 'basic');
                            }
                            if (complexArray[0].text == null) {
                                complexArray = ArticleDataService.complexArraySetup(val, 'basic');
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            }
                        } else {
                            if (placeHolder != null) {
                                if (placeHolder.charAt(0) != "," && placeHolder.charAt(0) != "." && placeHolder.charAt(0) != "'") {
                                    complexArray = ArticleDataService.complexArraySetup(placeHolder, 'basic');
                                } else {
                                    complexArray = ArticleDataService.complexArraySetup(placeHolder, 'basic');
                                }
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            }
                        }
                    }
                }
            }
        });
    }// end main article data processing

    //recommendations data processing
    getRecommendationsData(eventID) {
        var fullUrl = GlobalSettings.getArticleUrl() + "articles?&event=" + eventID + "&count=10&scope=mlb&readyToPublish=all&random=1";
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => ArticleDataService.formatRecommendedData(data.data));
    }

    static formatRecommendedData(data) {
        var result = [];
        var headlineData = data;
        if (headlineData) {
            for (var i = 6; i > result.length && headlineData.length;) {
                let j = headlineData.length;
                let rand = Math.floor(Math.random() * j);
                if (headlineData[rand].article_data != null) {
                    var eventType = headlineData[rand]['article_data'].report_type;
                    var eventId = headlineData[rand].event_id.toString();
                    result.push(ArticleDataService.getRandomArticles(headlineData[rand], eventType, eventId));
                    headlineData.splice(rand, 1);
                }
            }
        }
        return result.length == 6 ? result : null;
    }


    static getRandomArticles(recommendations, pageIndex, eventID) {
        return {
            title: recommendations.title,
            eventType: pageIndex,
            eventID: eventID,
            images: MLBGlobalFunctions.getBackroundImageUrlWithStockFallback(recommendations.image_url, GlobalSettings._imgAiRec),
            date: GlobalFunctions.formatGlobalDate(recommendations.last_updated * 1000, "dayOfWeek"),
            articleUrl: MLBGlobalFunctions.formatArticleRoute(pageIndex, eventID),
            keyword: recommendations.keywords[0].toUpperCase()
        };
    }//end recommendations data processing

    //trending data processing
    getAiTrendingData(count) {
        if (count == null) {
            count = 10;
        }
        var fullUrl = GlobalSettings.getArticleUrl();
        return this.http.get(fullUrl + "articles?page=1&count=" + count + "&scope=mlb&articleType=pregame-report&readyToPublish=all")
            .map(res => res.json())
            .map(data => data);
    }

    transformTrending(data, currentArticleId) {
        var articles = [];
        data.forEach(function (val) {
            var articleData;
            if (val.event_id != currentArticleId) {
                val["date"] = GlobalFunctions.formatGlobalDate(moment.unix(Number(val['last_updated'])), "timeZone");
                articleData = {
                    author: val['author'],
                    publisher: val['publisher'],
                    title: val.title,
                    date: val["date"],
                    teaser: val.teaser,
                    eventId: val.event_id,
                    eventType: "pregame-report",
                    image: MLBGlobalFunctions.getBackroundImageUrlWithStockFallback(val.image_url, GlobalSettings._deepDiveSm),
                    url: MLBGlobalFunctions.formatArticleRoute(val['article_type'], val.event_id),
                    rawUrl: window.location.protocol + "//" + window.location.host + "/articles/pregame-report/" + val.event_id
                };
                if (articleData != null) {
                    articles.push(articleData);
                }
            }
        });
        return articles;
    }//end trending data processing

    //headline data processing
    getAiHeadlineData(teamID, isLeague) {
        var fullUrl = GlobalSettings.getHeadlineUrl();
        return this.http.get(fullUrl + 'headlines?&team=' + teamID)
            .map(res => res.json())
            .map(headlineData => ArticleDataService.processHeadlineData(headlineData.data, teamID, isLeague));
    }

    getAiHeadlineDataLeague(isLeague) {
        var fullUrl = GlobalSettings.getArticleUrl();
        return this.http.get(fullUrl + "articles?page=1&count=15&scope=mlb&articleType=pregame-report&readyToPublish=all&metaDataOnly=1")
            .map(res => res.json())
            .map(headlineData => ArticleDataService.processHeadlineData(headlineData.data, null, isLeague));
    }

    static processHeadlineData(data, teamID, isLeague) {
        var scheduleData = !isLeague ? ArticleDataService.getScheduleData(data.home, data.away, teamID) : null;
        var mainArticleData = ArticleDataService.getMainArticle(data, isLeague);
        var subArticleData = !isLeague ? ArticleDataService.getSubArticles(data, data.event) : null;
        var leagueSubArticles = isLeague ? ArticleDataService.getLeagueSubArticles(data) : null;
        return {
            home: {
                id: !isLeague ? data['home'].id : null,
                name: !isLeague ? data['home'].name : null
            },
            away: {
                id: !isLeague ? data['away'].id : null,
                name: !isLeague ? data['away'].name : null
            },
            timestamp: !isLeague ? data.timestamp : data[0].last_updated ? data[0].last_updated : data[0].publication_date,
            scheduleData: scheduleData,
            mainArticleData: mainArticleData,
            subArticleData: subArticleData,
            leagueSubArticles: leagueSubArticles
        }
    }

    static getScheduleData(home, away, teamID) {
        var homeData = [];
        var awayData = [];
        var val = [];
        val['homeID'] = home.id;
        val['homeName'] = home.name;
        val['homeLocation'] = home.location;
        val['homeHex'] = home.hex;
        if (teamID == home.id) {
            val['homeLogo'] = ArticleDataService.setImageLogo(home.logo, true);
        } else {
            let homeLink = MLBGlobalFunctions.formatTeamRoute(home.location + ' ' + home.name, home.id);
            val['url'] = homeLink;
            val['homeLogo'] = ArticleDataService.setImageLogo([home.logo, homeLink], false);
        }
        val['homeWins'] = home.wins;
        val['homeLosses'] = home.losses;
        homeData.push(val);
        val = [];
        val['awayID'] = away.id;
        val['awayName'] = away.name;
        val['awayLocation'] = away.location;
        val['awayHex'] = away.hex;
        if (teamID == away.id) {
            val['awayLogo'] = ArticleDataService.setImageLogo(away.logo, true);
        } else {
            let awayLink = MLBGlobalFunctions.formatTeamRoute(away.location + ' ' + away.name, away.id);
            val['url'] = awayLink;
            val['awayLogo'] = ArticleDataService.setImageLogo([away.logo, awayLink], false);
        }
        val['awayWins'] = away.wins;
        val['awayLosses'] = away.losses;
        awayData.push(val);
        var gradient = ArticleDataService.gradientSetup(awayData[0], homeData[0]);
        return {
            gradient: gradient,
            awayData: awayData[0],
            homeData: homeData[0]
        }
    }

    static gradientSetup(away, home) {
        if (typeof home != 'undefined' && typeof away != 'undefined') {
            var fullGradient = Gradient.getGradientStyles([away.awayHex, home.homeHex], .75);
            var gradient = fullGradient ? fullGradient : null;
            var defaultGradient = fullGradient ? null : 'default-gradient';
        } else {
            var gradient = null;
            var defaultGradient = 'default-gradient';
        }
        return {
            fullGradient: gradient,
            defaultGradient: defaultGradient
        }
    }

    static getMainArticle(data, isLeague) {
        var titleFontSize;
        var pageIndex = !isLeague ? Object.keys(data['featuredReport'])[0] : "pregame-report";
        var articleContent = !isLeague ? data['featuredReport'][pageIndex][0].teaser : data[0].teaser;
        var trimmedArticle = articleContent.substring(0, 235);
        if (articleContent >= 85) {
            titleFontSize = "16px";
        } else {
            titleFontSize = "22px"
        }
        return {
            keyword: !isLeague ? ArticleDataService.setFeatureType(pageIndex) : "PREGAME",
            mainTitle: !isLeague ? data['featuredReport'][pageIndex][0].title : data[0].title,
            eventType: pageIndex,
            mainContent: trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" "))),
            mainImage: GlobalSettings.getImageUrl(!isLeague ?
                data['featuredReport'][pageIndex][0].image_url : data[0].image_url, GlobalSettings._imgHeadlineMain),
            articleUrl: MLBGlobalFunctions.formatArticleRoute(pageIndex, !isLeague ?
                data['featuredReport'][pageIndex][0].event_id : data[0].event_id),
            mainHeadlineId: isLeague ? data[0].event_id : data.event,
            titleFontSize: titleFontSize
        }
    }

    static getSubArticles(data, eventID) {
        var articles;
        var subArticleArr = [];
        var headToHeadArticleArr = [];
        var dataSet = Object.keys(data['otherReports']);
        dataSet.forEach(function (val) {
            if (eventID != val['event_id']) {
                switch (val) {
                    case'about-the-teams':
                    case'historical-team-statistics':
                    case'last-matchup':
                    case'starting-lineup-home':
                    case'starting-lineup-away':
                    case'injuries-home':
                    case'injuries-away':
                    case'upcoming':
                        articles = {
                            title: data['otherReports'][val].title,
                            eventType: val,
                            eventID: data['otherReports'][val].event_id,
                            images: GlobalSettings.getImageUrl(data['otherReports'][val].image_url, GlobalSettings._deepDiveSm),
                            articleUrl: MLBGlobalFunctions.formatArticleRoute(val, data['otherReports'][val].event_id)
                        };
                        subArticleArr.push(articles);
                        break;
                    case'pitcher-player-comparison':
                    case'catcher-player-comparison':
                    case'first-base-player-comparison':
                    case'second-base-player-comparison':
                    case'third-base-player-comparison':
                    case'shortstop-player-comparison':
                    case'left-field-player-comparison':
                    case'center-field-player-comparison':
                    case'right-field-player-comparison':
                    case'outfield-most-putouts':
                    case'outfielder-most-hits':
                    case'outfield-most-home-runs':
                    case'infield-most-hits':
                    case'infield-most-home-runs':
                    case'infield-best-batting-average':
                    case'infield-most-putouts':
                    case'hits-player-comparison':
                    case'home-runs-player-comparison':
                    case'rbis-player-comparison':
                    case'infield-putouts-player-comparison':
                    case'infield-fielding-player-comparison':
                    case'outfield-putouts-player-comparison':
                    case'outfield-fielding-player-comparison':
                        articles = {
                            title: data['otherReports'][val].title,
                            eventType: val,
                            eventID: data['otherReports'][val].event_id,
                            images: GlobalSettings.getImageUrl(data['otherReports'][val].image_url, GlobalSettings._deepDiveSm),
                            articleUrl: MLBGlobalFunctions.formatArticleRoute(val, data['otherReports'][val].event_id)
                        };
                        headToHeadArticleArr.push(articles);
                        break;
                }
            }
        });
        headToHeadArticleArr.sort(function () {
            return 0.5 - Math.random()
        });
        subArticleArr.sort(function () {
            return 0.5 - Math.random()
        });
        return {
            subArticles: subArticleArr.slice(0, 5),
            headToHeadArticles: headToHeadArticleArr.slice(0, 8)
        }
    }//end headline data processing

    static getLeagueSubArticles(data) {
        var articles;
        var leagueArr = [];
        data.forEach(function (val, index) {
            if (val.event_id && index != 0) {
                articles = {
                    title: val.title,
                    eventType: "pregame-report",
                    eventID: val.event_id,
                    images: GlobalSettings.getImageUrl(val.image_url, GlobalSettings._deepDiveSm),
                    articleUrl: MLBGlobalFunctions.formatArticleRoute("pregame-report", val.event_id)
                };
                leagueArr.push(articles);
            }
        });
        leagueArr.sort(function () {
            return 0.5 - Math.random()
        });
        return leagueArr;
    }

    //data configuring functions
    static setImageLogo(data, isHome):any {
        if (isHome) {
            return {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(data, GlobalSettings._imgScheduleLogo),
                    imageClass: "border-logo"
                }
            }
        } else {
            return {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(data[0], GlobalSettings._imgScheduleLogo),
                    urlRouteArray: data[1],
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "border-logo"
                }
            }
        }
    }

    getApiArticleType(type) {
        var articleType;
        switch (type) {
            case "pregame-report":
                return articleType = "articleType=pregame-report";
            case "in-game-report":
                return articleType = "articleType=in-game-report";
            case "postgame-report":
                return articleType = "articleType=postgame-report";
            case "upcoming-games":
                return articleType = "articleType=upcoming-games";
            case "about-the-teams":
                return articleType = "articleType=about-the-teams";
            case "historical-team-statistics":
                return articleType = "articleType=historical-team-statistics";
            case "last-matchup":
                return articleType = "articleType=last-matchup";
            case "rosters":
                return articleType = "articleType=player-fantasy";
            case "injuries":
                return articleType = "articleType=player-fantasy";
            case "player-comparisons":
                return articleType = "articleType=player-fantasy";
            case "player-daily-udate":
                return articleType = "articleType=player-fantasy";
            case "starting-roster-home-offense":
                return articleType = "articleSubType=starting-roster-home-offense";
            case "starting-roster-home-defense":
                return articleType = "articleSubType=starting-roster-home-defense";
            case "starting-roster-home-special-teams":
                return articleType = "articleSubType=starting-roster-home-special-teams";
            case "starting-roster-away-offense":
                return articleType = "articleSubType=starting-roster-away-offense";
            case "starting-roster-away-defense":
                return articleType = "articleSubType=starting-roster-away-defense";
            case "starting-roster-away-special-teams":
                return articleType = "articleSubType=starting-roster-away-special-teams";
            case "injuries-home":
                return articleType = "articleSubType=injuries-home";
            case "injuries-away":
                return articleType = "articleSubType=injuries-away";
            case "quarterback-player-comparison":
                return articleType = "articleSubType=quarterback-player-comparison";
            case "running-back-player-comparison":
                return articleType = "articleSubType=running-back-player-comparison";
            case "wide-receiver-player-comparison":
                return articleType = "articleSubType=wide-receiver-player-comparison";
            case "tight-end-player-comparison":
                return articleType = "articleSubType=tight-end-player-comparison";
            case "defense-player-comparison":
                return articleType = "articleSubType=defense-player-comparison";
            case "hits-player-comparison":
                return articleType = "articleSubType=hits-player-comparison";
            case "home-runs-player-comparison":
                return articleType = "articleSubType=home-runs-player-comparison";
            case "rbis-player-comparison":
                return articleType = "articleSubType=rbis-player-comparison";
            case "infield-putouts-player-comparison":
                return articleType = "articleSubType=infield-putouts-player-comparison";
            case "infield-fielding-player-comparison":
                return articleType = "articleSubType=infield-fielding-player-comparison";
            case "outfield-putouts-player-comparison":
                return articleType = "articleSubType=outfield-putouts-player-comparison";
            case "outfield-fielding-player-comparison":
                return articleType = "articleSubType=outfield-fielding-player-comparison";

        }
    }

    static getArticleType(articleType) {
        var articleInformation = [];
        switch (articleType) {
            case "pregame-report":
                return articleInformation = ["pregame-report", "gameReport", "null"];
            case "in-game-report":
                return articleInformation = ["in-game-report", "gameReport", "null"];
            case "postgame-report":
                return articleInformation = ["postgame-report", "gameReport", "null"];
            case "about-the-teams":
                return articleInformation = ["about-the-teams", "teamRecord", "about"];
            case "historical-team-statistics":
                return articleInformation = ["historical-team-statistics", "teamRecord", "history"];
            case "last-matchup":
                return articleInformation = ["last-matchup", "teamRecord", "last"];
            case "upcoming-games":
                return articleInformation = ["upcoming-games", "game_module", "null"];
            case "starting-roster-home":
                return articleInformation = ["starting-roster-home", "playerRoster", "null"];
            case "starting-roster-away":
                return articleInformation = ["starting-roster-away", "playerRoster", "null"];
            case "injuries-home":
                return articleInformation = ["injuries-home", "playerRoster", "null"];
            case "injuries-away":
                return articleInformation = ["injuries-away", "playerRoster", "null"];
            case "pitcher-player-comparison":
                return articleInformation = ["pitcher-player-comparison", "playerComparison", "null"];
            case "catcher-player-comparison":
                return articleInformation = ["catcher-player-comparison", "playerComparison", "null"];
            case "first-base-player-comparison":
                return articleInformation = ["first-base-player-comparison", "playerComparison", "null"];
            case "second-base-player-comparison":
                return articleInformation = ["second-base-player-comparison", "playerComparison", "null"];
            case "third-base-player-comparison":
                return articleInformation = ["third-base-player-comparison", "playerComparison", "null"];
            case "shortstop-base-player-comparison":
                return articleInformation = ["shortstop-base-player-comparison", "playerComparison", "null"];
            case "left-field-player-comparison":
                return articleInformation = ["left-field-player-comparison", "playerComparison", "null"];
            case "center-field-player-comparison":
                return articleInformation = ["center-field-player-comparison", "playerComparison", "null"];
            case "right-field-player-comparison":
                return articleInformation = ["right-field-player-comparison", "playerComparison", "null"];
            case "outfield-most-putouts":
                return articleInformation = ["outfield-most-putouts", "playerComparison", "null"];
            case "outfield-most-home-runs":
                return articleInformation = ["outfield-most-home-runs", "playerComparison", "null"];
            case "outfield-most-hits":
                return articleInformation = ["outfield-most-hits", "playerComparison", "null"];
            case "infield-most-putouts":
                return articleInformation = ["infield-most-putouts", "playerComparison", "null"];
            case "infield-most-home-runs":
                return articleInformation = ["third-base-player-comparison", "playerComparison", "null"];
            case "infield-most-hits":
                return articleInformation = ["shortstop-base-player-comparison", "playerComparison", "null"];
            case "infield-best-batting-average":
                return articleInformation = ["infield-best-batting-average", "playerComparison", "null"];
            case "hits-player-comparison":
                return articleInformation = ["hits-player-comparison", "playerComparison", "null"];
            case "home-runs-player-comparison":
                return articleInformation = ["home-runs-player-comparison", "playerComparison", "null"];
            case "rbis-player-comparison":
                return articleInformation = ["rbis-player-comparison", "playerComparison", "null"];
            case "infield-putouts-player-comparison":
                return articleInformation = ["infield-putouts-player-comparison", "playerComparison", "null"];
            case "infield-fielding-player-comparison":
                return articleInformation = ["infield-fielding-player-comparison", "playerComparison", "null"];
            case "outfield-putouts-player-comparison":
                return articleInformation = ["outfield-putouts-player-comparison", "playerComparison", "null"];
            case "outfield-fielding-player-comparison":
                return articleInformation = ["outfield-fielding-player-comparison", "playerComparison", "null"];
        }
    }

    static setFeatureType(pageIndex) {
        switch (pageIndex) {
            case'pregame-report':
                return 'PREGAME';
            case'postgame-report':
                return 'POSTGAME';
            default:
                return 'LIVE';
        }
    }

    static checkData(data) {
        return data
    }//end data configuring functions
}
