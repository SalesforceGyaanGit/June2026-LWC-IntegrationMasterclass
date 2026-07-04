public with sharing class DashboardChartController {
    
    @AuraEnabled(cacheable=true)
    public static Map<String,Integer> getAccountsByIndustry(){
        try {
            Map<String,Integer> result = new Map<String,Integer>();

            for(AggregateResult ar: [SELECT Industry, Count(Id) total FROM Account
            WHERE Industry != null GROUP BY Industry ORDER BY Count(Id) DESC]){
                result.put((String)ar.get('Industry'),(Integer)ar.get('total'));
            }
            return result;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}