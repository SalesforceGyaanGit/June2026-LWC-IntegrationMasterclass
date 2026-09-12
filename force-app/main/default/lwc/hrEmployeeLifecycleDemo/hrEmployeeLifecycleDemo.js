import { LightningElement } from 'lwc';

export default class HrEmployeeLifecycleDemo extends LightningElement {
    showCard = true;

    get buttonLabel(){
        return this.showCard?'Hide Card':'Show Card';
    }

    toggleCard(){
        this.showCard = !this.showCard;
    }
}