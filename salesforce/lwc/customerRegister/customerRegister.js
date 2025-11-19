import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCustomer from '@salesforce/apex/CustomerServiceController.createCustomer';

export default class CustomerRegister extends LightningElement {
    @api initialDocument;
    
    @track customer = {
        name: '',
        cpf: '',
        rg: '',
        birthDate: '',
        sex: '',
        email: '',
        phone: ''
    };

    sexOptions = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Feminino', value: 'Feminino' },
        { label: 'Outro', value: 'Outro' }
    ];

    connectedCallback() {
        if (this.initialDocument) {
            this.customer.cpf = this.initialDocument;
        }
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this.customer[field] = event.target.value;
    }

    handleSexChange(event) {
        this.customer.sex = event.detail.value;
    }

    validateForm() {
        const requiredFields = ['name', 'cpf', 'email', 'phone'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.customer[field]) {
                isValid = false;
            }
        });

        // Validate CPF format (basic validation)
        if (this.customer.cpf && !this.validateCPF(this.customer.cpf)) {
            isValid = false;
            this.showToast('Erro', 'CPF inválido', 'error');
        }

        // Validate email format
        if (this.customer.email && !this.validateEmail(this.customer.email)) {
            isValid = false;
            this.showToast('Erro', 'Email inválido', 'error');
        }

        return isValid;
    }

    validateCPF(cpf) {
        // Basic CPF validation - removes non-numeric characters and checks length
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleSubmit() {
        if (!this.validateForm()) {
            this.showToast('Erro', 'Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
            return;
        }

        const birthDate = this.customer.birthDate ? new Date(this.customer.birthDate) : null;

        createCustomer({
            name: this.customer.name,
            cpf: this.customer.cpf,
            rg: this.customer.rg,
            birthDate: birthDate,
            sex: this.customer.sex,
            email: this.customer.email,
            phone: this.customer.phone
        })
        .then(result => {
            this.showToast('Sucesso', 'Cliente registrado com sucesso!', 'success');
            this.dispatchEvent(new CustomEvent('registersuccess', {
                detail: { customerId: result.Id }
            }));
        })
        .catch(error => {
            this.showToast('Erro', 'Erro ao registrar cliente: ' + error.body.message, 'error');
        });
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
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

    get isFormValid() {
        return this.customer.name && this.customer.cpf && this.customer.email && this.customer.phone;
    }
}