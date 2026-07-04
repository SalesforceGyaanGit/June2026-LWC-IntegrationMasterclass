import { LightningElement } from 'lwc';
import ChartJs from '@salesforce/resourceUrl/mychart';  //use name of static resource
import {loadScript} from 'lightning/platformResourceLoader';
import getAccountsByIndustry from '@salesforce/apex/DashboardChartController.getAccountsByIndustry';

export default class AccountIndustryChartDashboard extends LightningElement {
    chart;
    chartLoaded = false; 
    labels = [];
    values = [];

    chartType = 'bar';
    chartOptions = [
        {label:'Bar',value:'bar'},
        {label:'Pie',value:'pie'},
        {label:'Doughnut',value:'doughnut'},
        {label:'Line',value:'line'},
        {label:'Radar',value:'radar'},
        {label:'Polar Area',value:'polarArea'},

    ];

    connectedCallback(){
        getAccountsByIndustry()
        .then(result=>{
            console.log('result is ',result);
            this.labels = Object.keys(result); 
            console.log('labels is ',this.labels);
            this.values = Object.values(result);
            console.log('values is ',this.values);
            this.loadChart();
        })
        .catch(error=>{
            console.error('error is == ',error);
        });
    }

    loadChart(){
        console.log('loadChart method is called');
        if(this.chartLoaded){
            console.log('chartLoaded ? ',this.chartLoaded);
            this.createChart();
            return;
        }

        // Load the chart.js file from static resource
        loadScript(this,ChartJs)
        .then(()=>{
            console.log('Chart Js loaded Successfully');
            this.chartLoaded = true;
            this.createChart();
        })
        .catch(error=>{
            console.error('Error while loading the chart is === ',error);
        });
    }

    createChart(){
        const canvas = this.template.querySelector('canvas');
        if(!canvas){
            return;
        }

        // Get the context of drawing
        const ctx = canvas.getContext('2d');

        //Destroy the previous chart
        if(this.chart){
            this.chart.destroy();
        }

        //create new chart
        this.chart = new Chart(ctx,{
            type: this.chartType,
            data:{
                labels: this.labels,
                datasets: [
                        {
                        label:'Accounts',
                        data: this.values,
                        borderWidth: 2,
                        backgroundColor: ['red','organge','yellow','Pink','green','blue','purple','black']
                        }
                        ]
                    },
            options:{
                responsive: true,
                maintainAspectRatio: false,
                plugins:{
                    legend:{
                        position:'bottom'
                    }
                }
            }
        });

    }
    handleChartChange(event){
        this.chartType = event.detail.value;
        this.createChart();
    }

}