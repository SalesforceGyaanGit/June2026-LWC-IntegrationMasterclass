import { LightningElement, wire } from 'lwc';
import fetchEmployeeDetails from '@salesforce/apex/EmployeeDirectoryContoller.fetchEmployeeDetails';
import createEmployeeRecord from '@salesforce/apex/EmployeeDirectoryContoller.createEmployeeRecord';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {refreshApex} from '@salesforce/apex';
import EMPLOYEEDETAILS_OBJECT from '@salesforce/schema/Employee_Detail__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Department__c';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';

const COLUMNS = [
    
    {label: 'Emp Code', fieldName: 'Name'},
    {label: 'Emp Name', fieldName: 'Employee_Name__c'},
    {label: 'Emp Phone', fieldName: 'Employee_Phone__c'},
    {label: 'Emp City', fieldName: 'Employee_City__c'},
    {label: 'Emp Email', fieldName: 'Employee_Email__c'},
    {label: 'Emp Department', fieldName: 'Employee_Department__c'}
];
export default class EmpWireAsProperty_Day3 extends LightningElement {
    tableColumns = COLUMNS;  // datatable columns
    selectedDept = '';  
    employeeRecs =[] ;  // because it is going to hold N number of records
    showForm = false;
    employee ={Employee_Name__c:'',Employee_Phone__c:'',Employee_Email__c:'',Employee_Department__c:''};
    wireResultData;
    departmentOptions = [];
    /*
    //For Hardcoded picklist values - static data
    departmentOptions = [
        {label:'All',value:''},{label:'IT',value:'IT'},{label:'Banking',value:'Banking'},
        {label:'Medical',value:'Medical'},{label:'Mechanical',value:'Mechanical'},
        {label:'Police',value:'Police'}
    ];*/

    @wire(getObjectInfo,{
        objectApiName:EMPLOYEEDETAILS_OBJECT
    }) employeeObjectInfo;

    //Fetch picklist values dynamically
    @wire(getPicklistValues,{
        recordTypeId: '$employeeObjectInfo.data.defaultRecordTypeId',
        fieldApiName:DEPARTMENT_FIELD
    }) wiredDeptValues({data,error}){
        if(data){
            this.departmentOptions = [
                {
                    label:'All', value:''
                },
                ...data.values
            ];
        }
        else if(error){
            console.error('Error is ==> ',error);
        }
    }



    handleDepartmentChange(event){
        console.log('Department Selected is == ',event.detail.value);
        this.selectedDept = event.detail.value;
    }
    //Wire as Property - START

    //@wire(fetchEmployeeDetails) employeeRecs;  // records list  -- Non Parameterized
      
    //selectedDept = ['IT','Banking','Police'];   // Incase of passing multiple parameters
    /*@wire(fetchEmployeeDetails,{
        department:'$selectedDept'
    }) employeeRecs;  // records list  -- Parameterized & Non Parameterized
    */ 

    //Wire as Property - END

    //Transition from Wire as Property to Wire as Function
    //Wire as Function - STARTS

    
    @wire(fetchEmployeeDetails,{
        department:'$selectedDept'
    }) wiredEmployeeRecords(result){
        console.log('Result is == ',result);
        this.wireResultData = result;

        if(result.data){
            console.log('Data is Present');
            this.employeeRecs = result.data.map(emp =>{
                return{
                    ...emp, Employee_Name__c:
                    emp.Employee_Name__c +
                    ' ('+
                    (emp.Employee_Department__c ? emp.Employee_Department__c:'Not Assigned')
                    +')'
                };
            });
        }
        else if(result.error){
            console.error('Error is == ',result.error);
            this.employeeRecs = [];
        }

    }

    handleForm(){
        console.log('Add Employee button is clicked, show form');
        this.showForm = true;
        console.log('Form is showing now == ',this.showForm);
    }
    handleInputChange(event){
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        console.log('fieldName is == ',fieldName);
        console.log('fieldValue is == ',fieldValue);

        this.employee ={...this.employee,[fieldName]:fieldValue};
        console.log('Employee Record == ',this.employee);
        console.log('Employee Record size == ',this.employee.length);
    }

    handleCloseModal(){
        console.log('Model close button is clicked');
        this.showForm = false;
    }

    //CREATE EMPLOYEE RECORD
    //on click on create button this method will be called
    handleCreateEmployeeRecord(){
        console.log('Create Employee Record is clicked');
        createEmployeeRecord({
            empRec:this.employee
        })
        .then(()=>{
            this.showToast('SUCCESS','Employee Created Successfully','success');
            this.showForm = false;
            this.employee ={Employee_Name__c:'',Employee_Phone__c:'',Employee_Email__c:'',Employee_Department__c:''};
            return refreshApex(this.wireResultData);
        })
        .catch(error=>{
            this.showToast('ERROR',error.body.message,'error');
        });

    }
    showToast(title,message,variant){
        this.dispatchEvent(new ShowToastEvent({title,message,variant}));            
    }

}