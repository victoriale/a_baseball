import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';

@Component({
    selector: 'contactus-module',
    templateUrl: './app/modules/contactus/contactus.module.html',
    directives:[BackTabComponent, TitleComponent],
    providers: []
})

export class ContactUsModule{
    @Input() contactusInput: Object;
    @Output() contactusOutput: EventEmitter<Object> = new EventEmitter();

    formSubmit(data){
        //Validate form inputs
        try{
            if(data.name === null){
                throw 'Please enter your name in the Full Name field.';
            }
            if(data.email === null){
                throw 'Please enter an email in the Email Address field.';
            }
            if(data.description === null){
                throw 'Please enter a message in the Description field.';
            }
        }catch(e){
            window.alert(e);
            return false;
        }
        //Pass form data to parent component
        this.contactusOutput.next(data);
    }

}