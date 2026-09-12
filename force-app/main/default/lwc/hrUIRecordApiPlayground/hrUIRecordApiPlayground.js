import { LightningElement } from 'lwc';
import EMPLOYEE_OBJECT from '@salesforce/schema/Employee_Detail__c';
import NAME_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Name__c';
import EMAIL_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Email__c';
import PHONE_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Phone__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Department__c';
import DESIGNATION_FIELD from '@salesforce/schema/Employee_Detail__c.Designation__c';
import SALARY_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Salary__c';
import {createRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class HrUIRecordApiPlayground extends LightningElement {
    name='';
    email='';
    phone='';
    department='';
    designation='';
    salary;

    handleChange(event){
        console.log('Handle Change is called');

        const field = event.target.dataset.field; 
        console.log('field is == '+field);

        switch(field){
            case 'Name':
            this.name = event.target.value;   //sagar
            break;
            
            case 'MyEmail__c':
            this.email = event.target.value;
            break;

            case 'Employee_Phone__c':
            this.phone = event.target.value;
            break;

            case 'Department__c':
            this.department = event.target.value;
            break;

            case 'Designation__c':
            this.designation = event.target.value;
            break;

            case 'Salary__c':
            this.salary = event.target.value;
            break;
        }
        console.log();
    }

    //Create Record 
    createEmployee(){
        console.log('createEmployee button clicked');
        
        if(!this.name){
            this.dispatchEvent(new ShowToastEvent({
                title:'Validation Error', message:'Employee Name is required', variant:'error'
            }));
            return;
        }

        const fields={};
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[EMAIL_FIELD.fieldApiName] = this.email;
        fields[PHONE_FIELD.fieldApiName] = this.phone;
        fields[DEPARTMENT_FIELD.fieldApiName] = this.department;
        fields[DESIGNATION_FIELD.fieldApiName] = this.designation;
        fields[SALARY_FIELD.fieldApiName] = this.salary;

        const recordInput={
            apiName: EMPLOYEE_OBJECT.objectApiName,  //Employee Detail
            fields:fields
        }

        createRecord(recordInput)
        
            .then(result=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Record Created', message:'Employee created successfully.',variant:'success'

                    })
                );
                console.log('Created Record Id is == ',result.id);
                this.resetForm();
            })
            .catch(error=>{
                console.log('Error is == ',error.body.message);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title:'Insert Failed', message:'error.body.message',variant:'error'

                    })
                );
            })
        
    }

    resetForm(){
        this.name='';
        this.email='';
        this.phone='';
        this.department='';
        this.designation='';
        this.salary='';
    }

}