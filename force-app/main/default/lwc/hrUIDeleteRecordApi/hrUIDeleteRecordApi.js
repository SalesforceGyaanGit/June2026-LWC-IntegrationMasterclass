import { LightningElement,wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Name__c';
import EMAIL_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Email__c';
import PHONE_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Phone__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Department__c';
import DESIGNATION_FIELD from '@salesforce/schema/Employee_Detail__c.Designation__c';
import SALARY_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Salary__c';
import {getRecord,deleteRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import LightningConfirm from 'lightning/confirm';

export default class HrUIDeleteRecordApi extends LightningElement {
    recordId;
    name='';
    email='';
    phone='';
    department='';
    designation='';
    salary;

    handleRecordSelection(event){        
    this.recordId = event.detail.recordId;
    console.log('handleRecordSelection is called with record Id == ',this.recordId);
    }

    @wire(getRecord,{
        recordId: '$recordId',
        fields:[
            NAME_FIELD,
            EMAIL_FIELD,
            PHONE_FIELD,
            DEPARTMENT_FIELD,
            DESIGNATION_FIELD,
            SALARY_FIELD
        ]
    })
    employeeHandler({data,error}){
        if(data){
            console.log('Data is present');
            this.name=data.fields.Employee_Name__c.value;
            this.email=data.fields.Employee_Email__c.value;
            this.phone=data.fields.Employee_Phone__c.value;
            this.department=data.fields.Employee_Department__c.value;
            this.designation=data.fields.Designation__c.value;
            this.salary=data.fields.Employee_Salary__c.value;
        }
        if(error){
            console.error(error);
        }
        
    }

    //Delete Employee Action

    async deleteEmployee(){
        const result = await LightningConfirm.open({
            message: 'Are you confirm to delete the record?',
            label:'Confirm Delete',
            theme: 'warning'
        });

        if(!result){
            return;
        }
        deleteRecord(this.recordId)
                .then(result=>{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title:'Record Deleted', message:'Employee deleted successfully.',variant:'success'
                            })
                        );
                        
                        this.resetForm();
                        })
                        .catch(error=>{
                            console.log('Error is == ',error.body.message);
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title:'Delete Failed', message:'error.body.message',variant:'error'
            
                                })
                            );
                        })
                }

    resetForm(){
        this.recordId = null;
        this.name='';
        this.email='';
        this.phone='';
        this.department='';
        this.designation='';
        this.salary=null;
    }

}