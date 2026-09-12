import { LightningElement, wire } from 'lwc';
import {publish,MessageContext} from 'lightning/messageService';
import EMPLOYEE_STATUS_CHANNEL from '@salesforce/messageChannel/EmployeeStatus__c';

export default class HrPublisherLms extends LightningElement {
    employeeName = '';
    status='';
    statusOptions = [
        {label:'Active',value:'Active'},
        {label:'InActive', value:'InActive'},
        {label:'Planned Leave', value:'Planned Leave'},
        {label:'Emergency Leave', value:'Emergency Leave'},
        {label:'Sick Leave',value:'Sick Leave'}
    ];

    @wire(MessageContext) messageContext;

    handleNameChange(event){
        console.log('handleNameChange Method is called');
        this.employeeName = event.target.value;
    }

    handleStatusChange(event){
        console.log('handleStatusChange Method is called');
        this.status = event.target.value;
    }

    handlePublish(){
        console.log();
        const message = {
            employeeName: this.employeeName,
            status: this.status
        };

        //Params for publish method: sMessageContext, Channel Name, DataObject
        publish(            
            this.messageContext,EMPLOYEE_STATUS_CHANNEL,message
        );
    }
}