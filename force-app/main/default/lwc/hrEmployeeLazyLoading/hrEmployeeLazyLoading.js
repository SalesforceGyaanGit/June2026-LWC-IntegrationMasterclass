import { LightningElement } from 'lwc';
import getEmployees from '@salesforce/apex/EmployeeDirectoryContoller.getEmployees';

export default class HrEmployeeLazyLoading extends LightningElement {

    employees = [];

    pageSize = 10;
    offset = 0;

    isLoading = false;
    hasMoreData = true;

    connectedCallback() {
        this.loadEmployees();
    }

    loadEmployees() {

        // Prevent multiple Apex calls
        if (this.isLoading || !this.hasMoreData) {
            return;
        }

        this.isLoading = true;

        getEmployees({
            limitSize: this.pageSize,
            offsetValue: this.offset
        })
        .then(result => {

            console.log('Employees ==> ', result);

            if (result.length > 0) {

                // Append new records
                this.employees = [...this.employees, ...result];

                // Increase Offset
                this.offset += result.length;

                // If returned records are less than page size,
                // it means no more records are available
                if (result.length < this.pageSize) {
                    this.hasMoreData = false;
                }

            } else {

                // No records returned
                this.hasMoreData = false;
            }

        })
        .catch(error => {
            console.error('Error ==> ', error);
        })
        .finally(() => {
            this.isLoading = false;
        });

    }

    handleScroll(event) {

        if (this.isLoading || !this.hasMoreData) {
            return;
        }

        const container = event.target;

        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;

        console.log(
            'Scroll Top : ', scrollTop,
            'Client Height : ', clientHeight,
            'Scroll Height : ', scrollHeight
        );

        // Load next records when user reaches near bottom
        if (scrollTop + clientHeight >= scrollHeight - 10) {

            console.log('Loading Next Records...');

            this.loadEmployees();
        }

    }

}