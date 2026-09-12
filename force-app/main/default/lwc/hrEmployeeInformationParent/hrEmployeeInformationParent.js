import { api, LightningElement } from 'lwc';

export default class HrEmployeeInformationParent extends LightningElement {
    @api parentCompanyName = 'Salesforce Gyaan Academy';
    testProperty = ''; 
    handleUpdate(){
        console.log('handle update method from parent JS called');
        this.template.querySelector('c-hr-employee-card-child').updateMessage();
        this.testProperty = this.template.querySelector('c-hr-employee-card-child').testProperty;
        this.template.querySelector('c-hr-employee-card-child').testProperty2 = 'Prashant';
    }

}