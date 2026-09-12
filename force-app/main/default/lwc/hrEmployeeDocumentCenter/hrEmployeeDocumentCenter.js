import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class HrEmployeeDocumentCenter extends LightningElement {
    recordId;
    selectedDocument = '';
    acceptedFormats=['.pdf','.png','.jpg','.jpeg','.doc','.docx'];
    documentOptions=[
        {label:'Resume',value:'Resume'},
        {label:'Aadhar Card',value:'Aadhar Card'},
        {label:'PAN Card',value:'PAN Card'},
        {label:'Passport',value:'Passport'},
        {label:'Offer Letter',value:'Offer Letter'},
        {label:'Experience Certificate',value:'Experience Certificate'},
        {label:'Internship Certificate',value:'Internship Certificate'}
    ];

    handleRecordSelection(event){
        console.log('handleRecordSelection method is called and Id is == ',event.detail.recordId);
        this.recordId = event.detail.recordId;
    }

    handleDocumentType(event){
        this.selectedDocument = event.detail.value;
        console.log('Document Selected is ==> ',this.selectedDocument);
    }

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        console.log('Uploaded Files == > ',uploadedFiles);

        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success', message:uploadedFiles.length+'file(s) uploaded successfully', variant:'success'
            })
        );

        uploadedFiles.forEach(
            file=>{
                console.log('File Name == >',file.name);
                console.log('Document Id ==>',file.documentId);
            }
        );
    }
}