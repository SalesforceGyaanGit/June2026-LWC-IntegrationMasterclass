public  class EmployeeDirectoryContoller {
    @AuraEnabled(cacheable=true)
    public static List<Employee_Detail__c> fetchEmployeeDetails(String department){  //''
        try{

            List<Employee_Detail__c> empDetails = new List<Employee_Detail__c>();
            if(String.isBlank(department)){
                system.debug('department in IF bloack == '+department);
                empDetails = [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c ORDER BY Name];
            }
            else{
                system.debug('department in ELSE bloack == '+department);
                empDetails = [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c WHERE Employee_Department__c=: department ORDER BY Name];
            }
            

            system.debug('size of empdetails === '+empDetails.size());
            return empDetails;
        }catch(Exception e){
            system.debug('error is == >'+e.getMessage());
            throw new AuraHandledException(e.getMessage());
          
        }
        
    }
    @AuraEnabled
    public static void createEmployeeRecord(Employee_Detail__c empRec){
        try {
            if(empRec!= Null){
                INSERT empRec;
                system.debug('Record has been successfully inserted through the apex class method');
            }
            else{
                system.debug('No Record is present to insert');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}