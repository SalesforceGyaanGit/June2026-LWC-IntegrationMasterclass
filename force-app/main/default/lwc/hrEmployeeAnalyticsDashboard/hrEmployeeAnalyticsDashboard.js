import { LightningElement } from 'lwc';
import ChartJs from '@salesforce/resourceUrl/chartSept';
import {loadScript} from 'lightning/platformResourceLoader';
import getDepartmentWiseEmployeeCount from '@salesforce/apex/HrChartController.getDepartmentWiseEmployeeCount';
export default class HrEmployeeAnalyticsDashboard extends LightningElement {
    chart;
    chartJsInitialized = false;

    label=[];
    employeeCount=[];
    selectedChart = 'bar';

    chartOptions=[
        {label:'Bar Chart', value:'bar'},
        {label:'Pie Chart', value:'pie'},
        {label:'Doughnut Chart', value:'doughnut'},
        {label:'Line Chart', value:'line'},
        {label:'Radar Chart', value:'radar'},
        {label:'Polar Area Chart', value:'polarArea'},
    ];

    renderedCallback(){
        if(this.chartJsInitialized){
            return;
        }
        this.chartJsInitialized = true;

        loadScript(this,ChartJs)
        .then(()=>{
            console.log('Chart js loaded successfully');
            this.loadChartData();
        })
        .catch(error=>{
            console.error('Error Loading Chart.js',error);
        });
    }

    loadChartData(){
        getDepartmentWiseEmployeeCount()
        .then(result=>{
            console.log('Chart Data',result);
            this.labels=[];
            this.employeeCount = [];

            result.forEach(item => {
                this.labels.push(item.department);
                this.employeeCount.push(item.count);
            });
            this.renderChart();
        })
        .error(error=>{
            console.log('Error is === ',error);
        });
    }

    renderChart(){
        const canvas = this.template.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        
        this.chart = new Chart(ctx,{
            type:this.selectedChart,
            data:{
                labels: this.labels,
                datasets:[
                    {
                        label:'Employees', 
                        data: this.employeeCount,
                        backgroundColor:[
                            '#1589EE','#4BC0C0','#FFCE56','#FF6384','#9966FF','#36A2EB'
                        ],
                        borderWidth:1
                    }
                                    
                ]
            },
            options:{
                responsive:true,
                maintainAspectRatio: false,
                plugins:{
                    legend:{
                        display:true,
                        position:'top'
                    },
                    tooltip:{
                        callbacks: {
                           label: function(context){
                            return context.label + ':'+context.raw;
                           } 
                            
                        }
                    }
                }
            }
        });
    }
    handleChartChange(event){
        this.selectedChart = event.detail.value;
        console.log('Selected Chart Type is == ', this.selectedChart);
        
        if(this.chart){
            this.chart.destroy();
        }
        this.renderChart();
    }
}