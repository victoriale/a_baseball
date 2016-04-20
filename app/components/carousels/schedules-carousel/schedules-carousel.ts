import {Component} from 'angular2/core';
import {CircleButton} from '../../buttons/circle/circle.button';
interface SchedulesCarouseInput{

}

@Component({
    selector: 'schedules-carousel',
    templateUrl: './app/components/carousels/schedules-carousel/schedules-carousel.html',
    directives: [CircleButton],
    providers: [],
})

export class SchedulesCarousel{

}
