import { LightningElement } from 'lwc';

export default class EmployeeRegistration_Day2 extends LightningElement {
    empName = '';
    empEmail = '';
    empPhone = '';
    empSalary = '';
    empJoiningDate = '';
    empDept='';
    empAddress = '';
    isChecked = false;
    isActive = false;

    deptOptions=[
        {label:'Engineering', value:'Engineering'},
        {label:'Medical', value:'Medical'},
        {label:'IT', value:'IT'},
        {label:'Mechanical', value:'Mechanical'}
    ];

    handleName(event){
        console.log('handleName clicked');
        this.empName = event.target.value;
        console.log('Name Typed as == ',this.empName);
    }
    handleEmailChange(event){
        this.empEmail = event.target.value;
        console.log('Email Typed as == ',this.empEmail);
    }
    handlePhone(event){
        this.empPhone = event.target.value;
        console.log('Phone Typed as == ',this.empPhone);
    }
    handleSalary(event){
        this.empSalary = event.target.value;
        console.log('Salary is == ',this.empSalary);
    }

    handleDate(event){
        this.empJoiningDate = event.target.value;
        console.log('Joining Date is == ',this.empJoiningDate);
    }

    handleDepartment(event){
        this.empDept = event.detail.value;
        console.log('Department is == ',this.empDept);
    }

    handleAddress(event){
        this.empAddress = event.target.value;
        console.log('Address is == ',this.empAddress);
    }

    handleCheckbox(event){
        this.isChecked = event.target.checked;
        console.log('Checkbox clicked ? ==> ',this.isChecked);
    }

    handleToggle(event){
        this.isActive = event.target.checked;
        console.log('Toggle Clicked ? ==>',this.isActive);
    }

    handleSave(){
        alert('Dummy Save Test, No logic required');
    }

    handleReset(){
        console.log('Reset Button has been clicked');
        this.empName = '';
        this.empEmail = '';
        this.empPhone = '';
        this.empSalary = '';
        this.empJoiningDate = '';
        this.empDept='';
        this.empAddress = '';
        this.isChecked = false;
        this.isActive = false;
    }

    handleDelete(){
        alert('Dummy Delete Test, No logic required');
    }
}