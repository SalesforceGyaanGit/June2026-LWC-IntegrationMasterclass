import { LightningElement } from 'lwc';

export default class EmployeeCard_Day1 extends LightningElement {
    // The variables that we create inside this scope, are known as Properties
    
    empName = 'Prashant Sontakke';
    empDesignation = 'Senior Salesforce Developer';
    department = 'IT';
    experience = '10 Years';
    project = 'LWC & Integration Masterclass';
    isActive = false;
    isOnLeave = false;

    
    handleActive(){
        console.log('Active button is clicked');
        this.isActive = true;
        this.isOnLeave = false;
    }
    handleOnLeave(){
        console.log('On Leave button is clicked');
        this.isOnLeave = true;
        this.isActive = false;
    }

}