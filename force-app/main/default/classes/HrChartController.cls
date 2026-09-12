public with sharing class HrChartController {
    public class DepartmentChartWrapper{
        
        @auraEnabled public String department;
        @auraEnabled public Integer count;

        public DepartmentChartWrapper(string department, integer count){
            this.department = department;
            this.count = count;
        }
    }

    @auraEnabled(cacheable=true)
    public static list<DepartmentChartWrapper> getDepartmentWiseEmployeeCount(){
        List<DepartmentChartWrapper> chartData = new List<DepartmentChartWrapper>();
        for(AggregateResult ar: [SELECT Employee_Department__c department, 
        COUNT(Id) totalEmployees FROM Employee_Detail__c WHERE Employee_Department__c !=null
        GROUP BY Employee_Department__c ORDER BY Employee_Department__c])
        {
            chartData.add(new DepartmentChartWrapper(
                (String)ar.get('department'), 
                (Integer)ar.get('totalEmployees')
            ));
        }
        return chartData;

    }

}