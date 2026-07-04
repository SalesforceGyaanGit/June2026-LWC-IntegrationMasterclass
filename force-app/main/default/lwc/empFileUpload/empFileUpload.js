import { api, LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class EmpFileUpload extends LightningElement {
    @api recordId;

    acceptedFormats =[
        '.pdf','.png','.jpeg','.jpg','.doc','.docx'
    ];

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;  // Return uploaded file details
        console.log('uploadedFiles == ',uploadedFiles);
        console.log('uploadedFiles length is == ',uploadedFiles.length);

        uploadedFiles.forEach(file=>{
            console.log('File Name === ',file.name);
            console.log('Document Id === ',file.documentId);
        });
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message: uploadedFiles.length + 'File(s) Uploaded Successfully',
                variant: 'success'
            })
        );
    }
}