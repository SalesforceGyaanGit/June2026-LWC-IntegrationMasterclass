import { LightningElement } from 'lwc';

export default class HrChildEmployeeRating extends LightningElement {
    rating;
    review;

    handleRatingChange(event){
        this.rating = event.target.value;
    }

    handleEmpReview(event){
        this.review = event.target.value;
    }

    handleSubmitReviewRating(){
        console.log('Submit button called');

        const feedbackEvent = new CustomEvent('empreviewandrating',{
            detail:{
                rating: this.rating,
                review: this.review
            },
            bubbles: true,   // Event will travel in parent hierarchy, so that parent can listen to the event
            composed: true   // Event can cross the Shadow DOM boundry of the component and grandparent/outer component can receive the event
        });
        this.dispatchEvent(feedbackEvent);
    }
}

