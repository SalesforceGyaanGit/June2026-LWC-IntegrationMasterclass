public  class EmployeeDirectoryContoller {
    @AuraEnabled(cacheable=true)
    public static List<Employee_Detail__c> fetchEmployeeDetails(String department, String searchKeyword){ 
        String keyword = '%'+searchKeyword+'%';

        try{

            List<Employee_Detail__c> empDetails = new List<Employee_Detail__c>();

            //Department and Search Both are blank
            if(String.isBlank(department) && String.isBlank(keyword)){
                
                system.debug('department and keyword both are blank');
                empDetails = [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c ORDER BY Employee_Name__c];
            }
            
            //Department is not blank
            if(!String.isBlank(department) && String.isBlank(keyword)){

                system.debug('department in IF bloack == '+department+' searchkeyword is blank here');
                empDetails = [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c WHERE Employee_Department__c =: department ORDER BY Employee_Name__c];
            }

            //Only searchkeyword is present  -- Global Search code is here
            if (String.isBlank(department) && !String.isBlank(keyword)){

                system.debug('searchkeyword in IF bloack == '+keyword+' department is blank here');
                empDetails = [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c WHERE Employee_Name__c LIKE:keyword OR Employee_Phone__c LIKE: keyword OR Employee_City__c LIKE:keyword
                OR Employee_Email__c LIKE: keyword
                ORDER BY Employee_Name__c];
            }
            
            //Department is not blank and searchkeyword is not blank  -- Global Search code is here
            if(!String.isBlank(department) && !String.isBlank(keyword)){

                system.debug('searchkeyword in IF bloack == '+keyword+' department is =='+department);
                empDetails = [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c WHERE (Employee_Name__c LIKE:keyword OR Employee_Phone__c LIKE: keyword OR 
                Employee_City__c LIKE:keyword OR Employee_Email__c LIKE: keyword) 
                AND Employee_Department__c =:department
                ORDER BY Employee_Name__c];
            }

            // Department is Mechanical and Employee phone = 8080

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
    @AuraEnabled
    public static void updateEmployeeRecord(Employee_Detail__c empUpdatedRec){
        try {
            if(empUpdatedRec!= Null){
                UPDATE empUpdatedRec;
                system.debug('Record has been successfully updated through the apex class method');
            }
            else{
                system.debug('No Record is present to insert');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @auraEnabled
    public static void deleteEmployeeRecord(Id deleteEmpRecordId){
        try{
            if(deleteEmpRecordId != NULL){
                Employee_Detail__c empRecord = [SELECT Id FROM Employee_Detail__c WHERE Id=:deleteEmpRecordId LIMIT 1]; 
                DELETE empRecord;
            }
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void sendEmailToEmployee(String toEmail, String subject, String body){
        try {

            List<String> emailList = new list<String>();
            emailList.add(toEmail);
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(emailList);
            email.setSubject(subject);
            email.setHtmlBody(body);

            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /*
    @AuraEnabled(cacheable=true)
    public static List<Employee_Detail__c> globalEmployeeSearch(String globalSearchkey){
        system.debug('globalEmployeeSearch called with Keyword == '+globalSearchkey);
        if(String.isBlank(globalSearchkey)){
            system.debug('IF Called');
            return [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c ORDER BY Name];
        }
        else{
            system.debug('ELSE Called');
            String Keyword = '%'+globalSearchkey+'%';
            return [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c WHERE Employee_Name__c LIKE:Keyword OR Employee_Email__c LIKE:Keyword 
                OR Employee_City__c LIKE:Keyword OR Employee_Phone__c LIKE:Keyword
                ORDER BY Name];
        }
    
    }*/

    @AuraEnabled
    public static List<Employee_Detail__c> getEmployees(Integer limitSize,Integer offsetValue){
        try {
            return [SELECT Id,Name,Employee_Name__c,Employee_Phone__c,Employee_City__c,
                Employee_Email__c,Employee_Department__c FROM
                Employee_Detail__c ORDER BY CreatedDate DESC LIMIT:limitSize OFFSET:offsetValue];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    
}