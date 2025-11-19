import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import generateUCNumber from '@salesforce/apex/CustomerServiceController.generateUCNumber';
import createCustomerAddress from '@salesforce/apex/CustomerServiceController.createCustomerAddress';

export default class NewConnectionFlow extends LightningElement {
    @api customerId;
    @api customerName;
    
    @track currentStep = 1;
    @track addressData = {};
    @track installationData = {};
    @track equipmentData = {};
    @track summaryData = {};
    
    distributors = [
        { label: 'Neoenergia Elektro', value: 'Neoenergia Elektro' },
        { label: 'Neoenergia Coelba', value: 'Neoenergia Coelba' },
        { label: 'Neoenergia Cosern', value: 'Neoenergia Cosern' },
        { label: 'Neoenergia Pernambuco', value: 'Neoenergia Pernambuco' }
    ];

    installationTypes = [
        { label: 'Residencial', value: 'residential' },
        { label: 'Comercial', value: 'commercial' },
        { label: 'Industrial', value: 'industrial' }
    ];

    phases = [
        { label: 'Monofásico', value: 'single' },
        { label: 'Bifásico', value: 'two' },
        { label: 'Trifásico', value: 'three' }
    ];

    get steps() {
        return [
            { id: 1, label: 'Checklist', active: this.currentStep === 1 },
            { id: 2, label: 'Endereço', active: this.currentStep === 2 },
            { id: 3, label: 'Instalação', active: this.currentStep === 3 },
            { id: 4, label: 'Equipamentos', active: this.currentStep === 4 },
            { id: 5, label: 'Resumo', active: this.currentStep === 5 },
            { id: 6, label: 'Confirmação', active: this.currentStep === 6 }
        ];
    }

    handleNext() {
        if (this.currentStep < 6) {
            this.currentStep++;
        }
    }

    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleAddressData(event) {
        this.addressData = event.detail;
    }

    handleInstallationData(event) {
        this.installationData = event.detail;
    }

    handleEquipmentData(event) {
        this.equipmentData = event.detail;
    }

    handleConfirmConnection() {
        // Generate UC Number
        generateUCNumber({ distributor: this.addressData.distributor })
            .then(ucNumber => {
                // Create customer address
                return createCustomerAddress({
                    customerId: this.customerId,
                    ucNumber: ucNumber,
                    address: this.getFullAddress(),
                    city: this.addressData.city,
                    cep: this.addressData.cep,
                    distributor: this.addressData.distributor
                });
            })
            .then(result => {
                this.showToast('Sucesso', 'Nova conexão criada com sucesso!', 'success');
                this.dispatchEvent(new CustomEvent('connectionsuccess', {
                    detail: { addressId: result.Id }
                }));
            })
            .catch(error => {
                this.showToast('Erro', 'Erro ao criar conexão: ' + error.body.message, 'error');
            });
    }

    getFullAddress() {
        const parts = [];
        if (this.addressData.address) parts.push(this.addressData.address);
        if (this.addressData.number) parts.push(this.addressData.number);
        if (this.addressData.neighborhood) parts.push(this.addressData.neighborhood);
        return parts.join(', ');
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

    get isStep1() { return this.currentStep === 1; }
    get isStep2() { return this.currentStep === 2; }
    get isStep3() { return this.currentStep === 3; }
    get isStep4() { return this.currentStep === 4; }
    get isStep5() { return this.currentStep === 5; }
    get isStep6() { return this.currentStep === 6; }

    get canGoNext() {
        switch (this.currentStep) {
            case 1: return true; // Checklist
            case 2: return this.addressData.address && this.addressData.city; // Address
            case 3: return this.installationData.type; // Installation
            case 4: return true; // Equipment
            case 5: return true; // Summary
            default: return false;
        }
    }
}