import { api, LightningElement } from 'lwc';

export default class HrEmployeeCardChild extends LightningElement {
    @api childCompanyName;  //public property to call from parent or any other component

    message = 'Welcome to LWC and Integration Masterclass';
    @api testProperty = 'Test Data';
    @api testProperty2;

    @api
    updateMessage(){
        console.log('updateMessage has been called');
        this.message = 'Masterclass 2026 Started..'
    }
    callMessage(){
        console.log('CallMessage has been called');
        //this.message = 'Masterclass 2026 Started..'
    }
    countNumber(){
        console.log('CountNumber has been called');
        //this.message = 'Masterclass 2026 Started..'
    }

    

}