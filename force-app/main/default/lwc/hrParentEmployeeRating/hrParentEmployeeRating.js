import { LightningElement } from 'lwc';

export default class HrParentEmployeeRating extends LightningElement {
    empRatingReceived;
    empReviewReceived;

    handleFeedback(event){
        console.log('handleFeedback method in parent JS called');
        this.empRatingReceived = event.detail.rating;
        this.empReviewReceived = event.detail.review;

    }

}