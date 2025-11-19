import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerSearchPanel extends NavigationMixin(LightningElement) {
    @track searchTerm = '';
    @track searchType = 'all';

    searchOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'UC', value: 'uc' },
        { label: 'CPF', value: 'cpf' },
        { label: 'Nome', value: 'name' },
        { label: 'Protocolo', value: 'protocol' }
    ];

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        if (this.searchTerm.length >= 3) {
            this.searchCustomers();
        }
    }

    handleSearchTypeChange(event) {
        this.searchType = event.detail.value;
    }

    searchCustomers() {
        // Dispatch event for parent component to handle search
        this.dispatchEvent(new CustomEvent('search', {
            detail: { 
                searchTerm: this.searchTerm,
                searchType: this.searchType 
            }
        }));
    }

    handleQuickAction(event) {
        const action = event.currentTarget.dataset.action;
        this.dispatchEvent(new CustomEvent('quickaction', {
            detail: { action }
        }));
    }

    handleAdvancedSearch() {
        this.dispatchEvent(new CustomEvent('advancedsearch'));
    }

    get isSearchValid() {
        return this.searchTerm && this.searchTerm.length >= 3;
    }
}