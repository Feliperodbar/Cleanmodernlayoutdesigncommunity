import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import getCustomerAddresses from '@salesforce/apex/CustomerServiceController.getCustomerAddresses';

const FIELDS = [
    'Customer__c.Name',
    'Customer__c.CPF__c',
    'Customer__c.RG__c',
    'Customer__c.BirthDate__c',
    'Customer__c.Sex__c',
    'Customer__c.Email__c',
    'Customer__c.Phone__c',
    'Customer__c.LastProtocol__c',
    'Customer__c.LastService__c'
];

export default class CustomerServiceLayout extends NavigationMixin(LightningElement) {
    @api recordId;
    @api customer;
    
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredCustomer({ error, data }) {
        if (data) {
            this.customer = {
                Id: data.id,
                Name: data.fields.Name.value,
                CPF__c: data.fields.CPF__c.value,
                RG__c: data.fields.RG__c.value,
                BirthDate__c: data.fields.BirthDate__c.value,
                Sex__c: data.fields.Sex__c.value,
                Email__c: data.fields.Email__c.value,
                Phone__c: data.fields.Phone__c.value,
                LastProtocol__c: data.fields.LastProtocol__c.value,
                LastService__c: data.fields.LastService__c.value
            };
            this.loadCustomerAddresses();
        } else if (error) {
            console.error('Error loading customer:', error);
        }
    }

    @wire(getCustomerAddresses, { customerId: '$recordId' })
    wiredAddresses({ error, data }) {
        if (data) {
            this.addresses = data;
        } else if (error) {
            console.error('Error loading addresses:', error);
        }
    }

    addresses = [];
    activeTab = 'overview';

    get customerInfo() {
        if (!this.customer) return null;
        
        return {
            ...this.customer,
            BirthDateFormatted: this.customer.BirthDate__c ? 
                new Date(this.customer.BirthDate__c).toLocaleDateString('pt-BR') : '',
            LastServiceFormatted: this.customer.LastService__c ? 
                new Date(this.customer.LastService__c).toLocaleDateString('pt-BR') : ''
        };
    }

    get activeAddresses() {
        return this.addresses.filter(addr => addr.Status__c === 'active');
    }

    get inactiveAddresses() {
        return this.addresses.filter(addr => addr.Status__c === 'inactive');
    }

    handleTabChange(event) {
        this.activeTab = event.target.value;
    }

    handleNewConnection() {
        this.dispatchEvent(new CustomEvent('newconnection'));
    }

    handleNewService() {
        this.dispatchEvent(new CustomEvent('newservice'));
    }

    handleAddressClick(event) {
        const addressId = event.currentTarget.dataset.id;
        // Navigate to address details or perform action
    }
}