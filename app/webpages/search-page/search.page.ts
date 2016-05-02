import {Component, OnInit} from 'angular2/core';
import {SearchPageModule} from '../../modules/search-page/search-page.module';

import {SearchPageInput} from '../../modules/search-page/search-page.module';

@Component({
    selector: 'search-page',
    templateUrl: './app/webpages/search-page/search.page.html',
    directives: [SearchPageModule],
    providers: []
})

export class SearchPage implements OnInit {
    public searchPageInput: Array<SearchPageInput> = [
        {
            tabName: 'Player (3)',
            isTabDefault: true,
            results : [
                {
                    title: '1 [Matching Search Term]\'s [Type] [Profile/Listing]',
                    urlText: 'https://www.[domainname].com/<span class="text-heavy">[Profile/PageName]</span>',
                    url: ['Disclaimer-page'],
                    description: 'Tortor [Search Name] Lorem ipsum dolor sit amet, consectetur adispicing elit. Aliquam sed erat ut nisi suscipit lobortis vitae sit amet lectus. Vestibulum nec tortor eros. Nullam tempus efficitur libero.'
                },
                {
                    title: '2 [Matching Search Term]\'s [Type] [Profile/Listing]',
                    urlText: 'https://www.[domainname].com/<span class="text-heavy">[Profile/PageName]</span>',
                    url: ['Disclaimer-page'],
                    description: 'Tortor [Search Name] Lorem ipsum dolor sit amet, consectetur adispicing elit. Aliquam sed erat ut nisi suscipit lobortis vitae sit amet lectus. Vestibulum nec tortor eros. Nullam tempus efficitur libero.'
                },
                {
                    title: '3 [Matching Search Term]\'s [Type] [Profile/Listing]',
                    urlText: 'https://www.[domainname].com/<span class="text-heavy">[Profile/PageName]</span>',
                    url: ['Disclaimer-page'],
                    description: 'Tortor [Search Name] Lorem ipsum dolor sit amet, consectetur adispicing elit. Aliquam sed erat ut nisi suscipit lobortis vitae sit amet lectus. Vestibulum nec tortor eros. Nullam tempus efficitur libero.'
                }
            ]
        },
        {
            tabName: 'Team (0)',
            results: []
        },
        {
            tabName: 'News (1)',
            results: [
                {
                    title: '1 [Matching Search Term]\'s [Type] [Profile/Listing]',
                    urlText: 'https://www.[domainname].com/<span class="text-heavy">[Profile/PageName]</span>',
                    url: ['Disclaimer-page'],
                    description: 'Tortor [Search Name] Lorem ipsum dolor sit amet, consectetur adispicing elit. Aliquam sed erat ut nisi suscipit lobortis vitae sit amet lectus. Vestibulum nec tortor eros. Nullam tempus efficitur libero.'
                }
            ]
        }
    ];

    ngOnInit() {

    }
}
