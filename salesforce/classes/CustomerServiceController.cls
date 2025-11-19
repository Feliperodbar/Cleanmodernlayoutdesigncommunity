public class CustomerServiceController {
    
    @AuraEnabled
    public static List<Customer__c> searchCustomers(String searchTerm) {
        String searchKey = '%' + searchTerm + '%';
        return [
            SELECT Id, Name, CPF__c, RG__c, BirthDate__c, Sex__c, Email__c, Phone__c, 
                   LastProtocol__c, LastService__c, CreatedDate
            FROM Customer__c
            WHERE Name LIKE :searchKey 
               OR CPF__c LIKE :searchKey
               OR Email__c LIKE :searchKey
            ORDER BY Name
            LIMIT 50
        ];
    }
    
    @AuraEnabled
    public static Customer__c getCustomerWithAddresses(Id customerId) {
        return [
            SELECT Id, Name, CPF__c, RG__c, BirthDate__c, Sex__c, Email__c, Phone__c, 
                   LastProtocol__c, LastService__c, CreatedDate,
                   (SELECT Id, Name, UCNumber__c, Address__c, City__c, CEP__c, Status__c, 
                           LastBill__c, DueDate__c, Consumption__c, Distributor__c
                    FROM CustomerAddresses__r
                    ORDER BY CreatedDate DESC)
            FROM Customer__c
            WHERE Id = :customerId
            LIMIT 1
        ];
    }
    
    @AuraEnabled
    public static Customer__c createCustomer(String name, String cpf, String rg, 
                                           Date birthDate, String sex, String email, String phone) {
        Customer__c customer = new Customer__c(
            Name = name,
            CPF__c = cpf,
            RG__c = rg,
            BirthDate__c = birthDate,
            Sex__c = sex,
            Email__c = email,
            Phone__c = phone,
            LastProtocol__c = generateProtocol(),
            LastService__c = Date.today()
        );
        
        insert customer;
        return customer;
    }
    
    @AuraEnabled
    public static CustomerAddress__c createCustomerAddress(Id customerId, String ucNumber, 
                                                          String address, String city, String cep, 
                                                          String distributor) {
        CustomerAddress__c customerAddress = new CustomerAddress__c(
            Name = address,
            UCNumber__c = ucNumber,
            Address__c = address,
            City__c = city,
            CEP__c = cep,
            Status__c = 'inactive',
            Distributor__c = distributor,
            Customer__c = customerId
        );
        
        insert customerAddress;
        return customerAddress;
    }
    
    @AuraEnabled
    public static String generateUCNumber(String distributor) {
        Map<String, String> distributorMap = new Map<String, String>{
            'Neoenergia Elektro' => '101',
            'Neoenergia Coelba' => '102',
            'Neoenergia Cosern' => '103',
            'Neoenergia Pernambuco' => '104'
        };
        
        String prefix = distributorMap.containsKey(distributor) ? distributorMap.get(distributor) : '105';
        String tail = '';
        
        while (tail.length() < 9) {
            tail += String.valueOf(Math.floor(Math.random() * 10));
        }
        
        return prefix + tail;
    }
    
    @AuraEnabled
    public static String generateProtocol() {
        return 'PROTOCOL-' + String.valueOf(DateTime.now().getTime());
    }
    
    @AuraEnabled
    public static List<CustomerAddress__c> getCustomerAddresses(Id customerId) {
        return [
            SELECT Id, Name, UCNumber__c, Address__c, City__c, CEP__c, Status__c, 
                   LastBill__c, DueDate__c, Consumption__c, Distributor__c
            FROM CustomerAddress__c
            WHERE Customer__c = :customerId
            ORDER BY CreatedDate DESC
        ];
    }
}