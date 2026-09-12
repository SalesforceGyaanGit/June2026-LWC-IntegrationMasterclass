import { LightningElement } from 'lwc';
import template from './hrEmployeeCardLifecycleDemo.html';
export default class HrEmployeeCardLifecycleDemo extends LightningElement {
    employeeName = 'Prashant Sontakke';
    designation = 'Salesforce Developer';

    constructor(){
        super();
        console.log('1. Constructor Called');
        console.log('1. Component Instance is created');
        console.log('======================');
    }

    connectedCallback(){
        console.log('2. Conencted Callback is called');
        console.log('Component inserted into the DOM');
        // This method is perfect place for Apex, LMS, Timers
        console.log('======================');
    }

    render(){
        console.log('3. Render()');
        console.log('Salesforce is preparing UI');
        console.log('======================');
        return template;
    }

    renderedCallback(){
        console.log('4. RenderedCallback()');
        console.log('DOM is now ready and it is safe to access HTML elements');
        console.log('======================');
    }

    disconnectedCallback(){
        console.log('5. DisconnectedCallback called');
        console.log(' component is removed from the DOM, cleanup resources here');
    }
    promoteEmployee(){
        console.log('promote employee button is clicked');
        this.designation = 'Salesforce Architect';
    }
}