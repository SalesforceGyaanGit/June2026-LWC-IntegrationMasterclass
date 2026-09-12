import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class HrLDSPlayground extends LightningElement {
    selectedObject='Account';
    recordId;
    selectedMode='view';

    objectOptions=[
        {label:'Account', value:'Account'},
        {label:'Employee Detail', value:'Employee_Detail__c'},
        {label:'Contact', value:'Contact'}
    ];

    modeOptions=[
        {label:'Record View Form', value:'view'},
        {label:'Record Edit Form', value:'edit'},
        {label:'Record Form', value:'record'}
    ]

    recordFormFields=['Name','OwnerId','MyEmail__c'];


    handleObjectChange(event){
        console.log('handleObjectChange method called : object name',event.detail.value);
        this.selectedObject = event.detail.value;
        this.recordId= null;
    }

    handleRecordSelection(event){
        console.log('handleRecordSelection method called');
        this.recordId = event.detail.recordId;
        console.log('selected record Id is == ',this.recordId);

    }

    handleModeChange(event){
        console.log('handleModeChange method called --',event.detail.value);
        this.selectedMode = event.detail.value;
    }

    handleSuccess(event){
        console.log('handleSuccess called in JS');
        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title:'Success', message:'Record Updated Successfully', variant:'success'
                }
            )
        );
    }

    handleError(event){
        console.log('handleError called in JS');
        this.dispatchEvent(
            new ShowToastEvent(
                {
                    title:'Error', message:'Record failed to update', variant:'error'
                }
            )
        );
    }

    handleSubmit(){
        console.log('handleSubmit is called in JS');
    }

    get isViewForm(){
        return this.selectedMode ==='view';
    }
    get isEditForm(){
        return this.selectedMode ==='edit';
    }
    get isRecordForm(){
        return this.selectedMode ==='record';
    }
}