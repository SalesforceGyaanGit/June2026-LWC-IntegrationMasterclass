import { LightningElement, wire } from 'lwc';
import {subscribe,unsubscribe,MessageContext} from 'lightning/messageService';
import EMPLOYEE_STATUS_CHANNEL from '@salesforce/messageChannel/EmployeeStatus__c';
export default class HrSubscriberLms extends LightningElement {
    employeeName = 'No Employee Selected';
    employeeStatus = 'No Status Received';

    subscription = null;

    @wire(MessageContext) messageContext;

    connectedCallback(){
        console.log('Connected callback');
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel(){
        console.log('subscribeToMessageChannel called');

        if(this.subscription){
            console.log('this.subscription ===>'+this.subscription);
            return;
        }

        this.subscription = subscribe(this.messageContext,EMPLOYEE_STATUS_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }
        handleMessage(message){
            console.log('handleMessage called');
            this.employeeName = message.employeeName;
            this.employeeStatus = message.status;
        }

        disconnectedCallback(){
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    
}