import { LightningElement, wire } from 'lwc';
import fetchEmployeeDetails from '@salesforce/apex/EmployeeDirectoryContoller.fetchEmployeeDetails';
import createEmployeeRecord from '@salesforce/apex/EmployeeDirectoryContoller.createEmployeeRecord';
import updateEmployeeRecord from '@salesforce/apex/EmployeeDirectoryContoller.updateEmployeeRecord';
import deleteEmployeeRecord from '@salesforce/apex/EmployeeDirectoryContoller.deleteEmployeeRecord';
import sendEmailToEmployee from '@salesforce/apex/EmployeeDirectoryContoller.sendEmailToEmployee';
/*
// commented this method to just to refactor this code
import globalEmployeeSearch from '@salesforce/apex/EmployeeDirectoryContoller.globalEmployeeSearch';
*/
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {refreshApex} from '@salesforce/apex';
import EMPLOYEEDETAILS_OBJECT from '@salesforce/schema/Employee_Detail__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Employee_Detail__c.Employee_Department__c';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import { NavigationMixin } from "lightning/navigation";
import LightningConfirm from "lightning/confirm";
//import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';    //No use -- Added for standard email composer

const ROW_ACTIONS = [
    {label:'View', name:'view',iconName:'utility:preview'},
    {label:'Edit', name:'edit',iconName:'utility:edit'},
    {label:'Delete', name:'delete',iconName:'utility:delete'},
    {label:'Send Email', name:'sendEmail',iconName:'utility:email'}
];

const COLUMNS = [
    
    {label: 'Emp Code', fieldName: 'Name'},
    {label: 'Emp Name', fieldName: 'Employee_Name__c'},
    {label: 'Emp Phone', fieldName: 'Employee_Phone__c'},
    {label: 'Emp City', fieldName: 'Employee_City__c'},
    {label: 'Emp Email', fieldName: 'Employee_Email__c'},
    {label: 'Emp Department', fieldName: 'Employee_Department__c'},
    // Implemented for previous scenario
    /*
    {label: 'Action', type:'button', initialWidth:130,
        typeAttributes:{
            //label:'View',name:'View',iconName:'utility:preview',iconPosition:'left',variant:'brand'
        }
    }*/

    // Implemented for New scenario
    {
        type:'action',
        typeAttributes:{
            rowActions:ROW_ACTIONS
        }
    }
];

export default class HrEmployeeClientPagination extends NavigationMixin(LightningElement) {
    tableColumns = COLUMNS;  // datatable columns
    selectedDept = '';  
    employeeRecs =[] ;  // because it is going to hold N number of records
    showForm = false;
    employee ={Employee_Name__c:'',Employee_Phone__c:'',Employee_Email__c:'',Employee_Department__c:''};
    wireResultData;
    departmentOptions = [];
    isEditMode = false;
    showEmailModel = false;
    emailSubject = '';
    emailBody = '';
    globalSearchKeyword='';
    delayTimeout;
    isSearching = false;

    //Pagination Variables
    pageSize = 10;   // Limit
    currentPage = 1;  // By Default its 1st Page
    totalRecords = 0;  // count of total employee record
    totalPages = 0;
    paginatedEmployees = [];  // Only the employees of current page will be stored here

    get modalTitle(){
        return this.isEditMode?'UPDATE EMPLOYEE':'ADD EMPLOYEE';
    }

    get buttonLabel(){
        return this.isEditMode?'UPDATE':'CREATE';
    }

    /*
    //For Hardcoded picklist values - static data
    departmentOptions = [
        {label:'All',value:''},{label:'IT',value:'IT'},{label:'Banking',value:'Banking'},
        {label:'Medical',value:'Medical'},{label:'Mechanical',value:'Mechanical'},
        {label:'Police',value:'Police'}
    ];*/

    /* Global Search Functionality */
    handleGlobalSearch(event){
        console.log('handleGlobalSearch called');

        const searchValue = event.target.value.trim();
        console.log('trimmed searched value is == ',searchValue);
        clearTimeout(this.delayTimeout);

        //Empty Search
        if(searchValue === ''){
            this.globalSearchKeyword = '';
            this.isSearching = false;
            return;
        }

        //Minimum Character Validation
        if(searchValue.length < 2){
            this.isSearching = false;
            return;
        }

        this.isSearching = true;
        this.delayTimeout = setTimeout(()=>{
             this.globalSearchKeyword = searchValue;
        },500)

        /*
        //Commented to teach deboucing concept
        this.globalSearchKeyword = event.target.value;
        console.log('Global search keyword is === ',this.globalSearchKeyword);*/
    }

    /*
    //Commented to avoid multiple apex methods, and multiple wire calls
    @wire(globalEmployeeSearch,{
        globalSearchkey: '$globalSearchKeyword'
    })
    wiredGlobalData(result){
        this.wireResultData = result;
        if(result.data){
            this.employeeRecs = result.data;
        }
        else if(result.error){
            console.error(result.error);
        }
        
    }
    */



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
        department:'$selectedDept',
        searchKeyword: '$globalSearchKeyword'
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
            this.currentPage = 1;
            this.calculatePagination();
        }
        else if(result.error){
            console.error('Error is == ',result.error);
            this.employeeRecs = [];
        }

    }

    // Pagination logic starts here
    calculatePagination(){
        console.log('calculatePagination method called ');
        this.totalRecords = this.employeeRecs.length;   // totalRecords = 1000
        console.log('totalRecords length is ',this.totalRecords);

        // find how many total pages are required
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        console.log('total pages will be created are == ',this.totalPages);

        this.updatePaginatedEmployees();

    }

    updatePaginatedEmployees(){
        const startIndex = (this.currentPage - 1)*this.pageSize;
        const endIndex = startIndex +this.pageSize;
        console.log('Start Index == ',startIndex);
        console.log('End Index == ',endIndex);

        this.paginatedEmployees = this.employeeRecs.slice(startIndex,endIndex);
        console.log('size of paginated employees == ',this.paginatedEmployees.length);
        console.log('paginated employees == ',this.paginatedEmployees);
    }

    handlePrevious(){
        if(this.currentPage > 1){
            this.currentPage--;
            this.updatePaginatedEmployees();
        }
    }

    handleNext(){
        if(this.currentPage < this.totalPages){
            this.currentPage++;
            this.updatePaginatedEmployees();
        }
    }

    get disabledPrevious(){
        return this.currentPage === 1;   // return true
    }

    get disabledNext(){
        return this.currentPage === this.totalPages;   // return true
    }

    get startRecord(){
        return ((this.currentPage - 1)* this.pageSize)+1;
    }
    get endRecord(){
        const end = this.currentPage * this.pageSize;

        return end > this.totalRecords? this.totalRecords:end;
    }

    handleForm(){
        this.isEditMode = false;
        this.employee = {Employee_Name__c:'',Employee_Phone__c:'',Employee_Email__c:'',Employee_Department__c:''};
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
    handleSaveEmployeeRecord(){
        
        if(!this.isEditMode){
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
        else{
            console.log('Update Employee Record is Clicked');
            updateEmployeeRecord({
                empUpdatedRec:this.employee
            })
            .then(()=>{
                this.showToast('SUCCESS','Employee Updated Successfully','success');
                this.showForm = false;
                this.employee ={Employee_Name__c:'',Employee_Phone__c:'',Employee_Email__c:'',Employee_Department__c:''};
                return refreshApex(this.wireResultData);
            })
            .catch(error=>{
                this.showToast('ERROR',error.body.message,'error');
            });
        }
        

    }
    

    handleRowAction(event){
        console.log('handleRowAction method is clicked');
        const actionName = event.detail.action.name;
        console.log('actionName is ==',actionName );

        const selectedEmployee = event.detail.row;
        console.log('Record Name is ',selectedEmployee.Employee_Name__c);
        console.log('Email Address is ',selectedEmployee.Employee_Email__c);

        /*
        // Implemented for View Button - OLD Scenarios
        if(actionName === 'View'){
            // call the method which will  navigate the record
            console.log('In If block');
            this.naviagateToEmployeeRecord(selectedEmployee.Id);
        }
        else{
            alert('Wrong Action');
        }*/

        //Implemented for Multiple Row Actions - NEW Scenario    
        switch(actionName){
            case 'view':
                this.navigateToEmployeeRecord(selectedEmployee.Id);
            break;

            case 'edit':
                //this.showToast('INFO','Edit functionality will be implemented in next session','Info');
                this.isEditMode = true;
                this.employee = {...selectedEmployee};
                this.showForm = true;
                break;
            
            case 'delete':
                //this.showToast('INFO','Delete functionality will be implemented in next session','Info');
                this.handleDeleteEmployee(selectedEmployee.Id);
                break; 
            
            case 'sendEmail':
                //this.showToast('INFO','SendEmail functionality will be implemented in next session','Info');
                //this.handleSendEmail(selectedEmployee.Id);   //-- Called for Standard Email Composer - But of No Use  
                this.employee = {...selectedEmployee};
                this.emailSubject='';
                this.emailBody = '';
                this.showEmailModel = true;
                break;     

            default:
                this.showToast('Error','Unknown Error','error');    

        }

    }

    handleSubjectChange(event){
        this.emailSubject = event.target.value;
    }

    handleBodyChange(event){
        this.emailBody = event.target.value;
    }

    handleCloseEmailModal(){
        console.log('Cancel button clicked');
        this.showEmailModel = false;
    }

    handleSendEmail(){

        console.log("Send Email Button is clicked");

        if(!this.emailSubject || !this.emailBody){
            this.showToast('Warning','Subject and Body are required','warning');
            return;
        }

        console.log('Email address is == ',this.employee.Employee_Email__c);

        //const toEmail = this.employee.Employee_Email__c;
        sendEmailToEmployee({
            toEmail: this.employee.Employee_Email__c,
            subject: this.emailSubject,
            body: this.emailBody
        })
        .then(()=>{
            this.showToast('EMAIL SENT','The Email has been sent to '+this.employee.Employee_Email__c+' successfully','success');
        })
        .catch(error=>{
            this.showToast('SENDING FAILED','We are not able to send email to '+this.employee.Employee_Email__c+' due to the error '+error.body.message+' ','error');
        })
    }

    navigateToEmployeeRecord(recordId){
        console.log('record id received is == ',recordId);
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:recordId,
                objectApiName:'Employee_Detail__c',   //Optional
                actionName: 'view'
            }
        });
    }

    
    //Delete Method
    async handleDeleteEmployee(recordId){
        
        const result = await LightningConfirm.open({
            message: 'Are you sure, you want to delete this employee record?',
            label: 'Confirm deletion?',
            variant: 'header'
        });
        console.log('confirm result', result);
        if(result){
            this.deleteEmployee(recordId);    // Call Apex class method from here to delete the record
        }
    }
    deleteEmployee(recordId){
        deleteEmployeeRecord({
            deleteEmpRecordId: recordId
        })
        .then(()=>{
            this.showToast('Record Deleted','Employee Record has been deleted successfully','success');
            return refreshApex(this.wireResultData);
        })
        .catch(error=>{
            this.showToast('ERROR',error.body.message,'error');
        });
    }

    /*
    //Not Of any use
    handleSendEmail(recordId){
        const defaultValues = encodeDefaultFieldValues({
            subject: 'Greeting from Employee Information Portal',
            HtmlBody: '<p>Hi there,</p><p>This is a test email sent from LWC.</p>'
            //RelatedToId: this.recordId
        })
        this[NavigationMixin.Navigate]({
            type:'standard__quickAction',
            attributes: {
                apiName: 'Global.SendEmail'
            },
            state: {
                recordId: this.recordId,
                encodeDefaultFieldValues:defaultValues
            }
        });
    }*/

    showToast(title,message,variant){
        this.dispatchEvent(new ShowToastEvent({title,message,variant}));            
    }

    

    }

