import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control} from '@angular/common';

@Component({
    selector: 'contactus-module',
    templateUrl: './app/modules/contactus/contactus.module.html',
    directives:[FORM_DIRECTIVES, BackTabComponent, TitleComponent],
    providers: []
})

export class ContactUsModule{
    @Input() contactusInput: Object;
    @Output() contactusOutput = new EventEmitter();
    private active:boolean = true;// by default set the form to a pristine state on load
    formSubmit(data){
        //Validate form inputs
        try{
            if(data.description === null && data.email === null && data.name === null){
                throw 'Please enter your name, email, and a detailed description';
            }
            if(data.description === null && data.email === null){
                throw 'Please enter your email and a detailed description';
            }
            if(data.description === null && data.name === null){
                throw 'Please enter your name and a detailed description';
            }
            if(data.email === null && data.name === null){
              throw 'Please enter your name and email';
            }
            if(data.name === null || data.name.length == 0){
                throw 'Please enter your name in the Full Name field.';
            }
            if(data.email === null){
                throw 'Please enter an email in the Email Address field.';
            }
            if(data.description === null || data.description.length == 0){
                throw 'Please enter a message in the Description field.';
            }

            data.email = data.email ? data.email.trim() : "";
            var emailPattern = /^.+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailPattern.test(data.email)) {
                throw 'Please enter a valid email in the Email Address field.';
            }
        }catch(e){
            window.alert(e);
            return false;
        }
        //Pass form data to parent component
        this.contactusOutput.next(data);
        alert('Form has been submitted check email:\n '+ data.email +'\n For your ticket');
        // reset the  form by removing it and re-adding the form to a new pristine state
        this.active = false;
        setTimeout(()=> this.active=true, 0);
    }

    // reset the  form by removing it and re-adding the form to a new pristine state
    reset(){
      this.active = false;
      setTimeout(()=> this.active=true, 0);
    }
}
