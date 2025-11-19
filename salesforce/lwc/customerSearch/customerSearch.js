import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchCustomers from '@salesforce/apex/CustomerServiceController.searchCustomers';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerSearch extends NavigationMixin(LightningElement) {
    @track searchTerm = '';
    @track customers = [];
    @track isSearching = false;
    @track showResults = false;

    distributors = [
        { label: 'Neoenergia Elektro', value: 'Neoenergia Elektro' },
        { label: 'Neoenergia Coelba', value: 'Neoenergia Coelba' },
        { label: 'Neoenergia Cosern', value: 'Neoenergia Cosern' },
        { label: 'Neoenergia Pernambuco', value: 'Neoenergia Pernambuco' }
    ];

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        if (this.searchTerm.length >= 3) {
            this.searchCustomers();
        } else {
            this.showResults = false;
        }
    }

    searchCustomers() {
        this.isSearching = true;
        
        searchCustomers({ searchTerm: this.searchTerm })
            .then(result => {
                this.customers = result;
                this.showResults = true;
                this.isSearching = false;
            })
            .catch(error => {
                this.showToast('Erro', 'Erro ao buscar clientes: ' + error.body.message, 'error');
                this.isSearching = false;
            });
    }

    handleCustomerSelect(event) {
        const customerId = event.currentTarget.dataset.id;
        this.navigateToCustomer(customerId);
    }

    handleQuickAction(event) {
        const action = event.currentTarget.dataset.action;
        const distributor = event.currentTarget.dataset.distributor;
        
        this.dispatchEvent(new CustomEvent('quickaction', {
            detail: { action, distributor }
        }));
    }

    handleRegisterNew() {
        this.dispatchEvent(new CustomEvent('registernew'));
    }

    navigateToCustomer(customerId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: customerId,
                objectApiName: 'Customer__c',
                actionName: 'view'
            }
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }

    get hasResults() {
        return this.customers && this.customers.length > 0;
    }

    get noResults() {
        return this.showResults && (!this.customers || this.customers.length === 0);
    }
}