# Conversão Salesforce - Guia de Implantação

## Visão Geral
Este projeto foi convertido de React/TypeScript para Salesforce utilizando:
- **Apex Classes** para lógica de negócios
- **Lightning Web Components (LWC)** para interface moderna
- **Visualforce Pages** para compatibilidade herdada
- **Tailwind CSS** para estilização

## Estrutura do Projeto
```
salesforce/
├── classes/                 # Classes Apex
│   ├── CustomerServiceController.cls
│   └── CustomerServiceController.cls-meta.xml
├── objects/                 # Objetos personalizados
│   ├── Customer__c.object
│   └── CustomerAddress__c.object
├── lwc/                     # Lightning Web Components
│   ├── customerSearch/
│   ├── customerServiceLayout/
│   ├── customerRegister/
│   └── newConnectionFlow/
├── pages/                   # Páginas Visualforce
│   ├── CustomerServicePage.page
│   └── CustomerServicePage.page-meta.xml
├── staticresources/         # Recursos estáticos
│   └── tailwindLWC.css
├── package.xml             # Manifesto de pacote
└── tailwind.config.js      # Configuração Tailwind
```

## Objetos Personalizados

### Customer__c (Cliente)
- **Name**: Nome do cliente (Texto)
- **CPF__c**: CPF (Texto, único, obrigatório)
- **RG__c**: RG (Texto)
- **BirthDate__c**: Data de nascimento (Data)
- **Sex__c**: Sexo (Picklist: Masculino, Feminino, Outro)
- **Email__c**: Email (Email)
- **Phone__c**: Telefone (Phone)
- **LastProtocol__c**: Último protocolo (Texto)
- **LastService__c**: Último atendimento (Data)

### CustomerAddress__c (Endereço do Cliente)
- **Name**: Endereço (Texto)
- **UCNumber__c**: Número UC (Texto, único, obrigatório)
- **Address__c**: Endereço completo (Texto)
- **City__c**: Cidade (Texto)
- **CEP__c**: CEP (Texto)
- **Status__c**: Status (Picklist: active, inactive, suspended)
- **LastBill__c**: Última conta (Texto)
- **DueDate__c**: Data de vencimento (Texto)
- **Consumption__c**: Consumo (Texto)
- **Distributor__c**: Distribuidora (Texto)
- **Customer__c**: Cliente (Master-Detail)

## Componentes LWC

### customerSearch
Componente de busca de clientes com funcionalidades:
- Busca por nome, CPF ou email
- Ações rápidas (Nova Conexão, Registrar Cliente)
- Lista de resultados com navegação

### customerServiceLayout
Layout principal de atendimento com:
- Informações do cliente
- Lista de endereços (ativos/inativos)
- Abas de navegação (Visão Geral, Histórico)
- Botões de ação (Nova Conexão, Novo Atendimento)

### customerRegister
Formulário de registro de novos clientes com:
- Validação de CPF e email
- Campos obrigatórios
- Integração com Apex Controller

### newConnectionFlow
Fluxo de nova conexão em múltiplas etapas:
- Checklist de documentos
- Endereço
- Detalhes da instalação
- Equipamentos
- Resumo e confirmação

## Implantação

### 1. Deploy dos Objetos
```bash
# Usar Salesforce CLI ou Change Sets
sfdx force:source:deploy -p salesforce/objects
```

### 2. Deploy das Classes Apex
```bash
sfdx force:source:deploy -p salesforce/classes
```

### 3. Deploy dos Componentes LWC
```bash
sfdx force:source:deploy -p salesforce/lwc
```

### 4. Deploy das Páginas Visualforce
```bash
sfdx force:source:deploy -p salesforce/pages
```

### 5. Configurar Permissões
- Adicionar permissões de objeto para Customer__c e CustomerAddress__c
- Configurar acesso às classes Apex
- Adicionar componentes LWC às Lightning App Pages

## Configuração do Tailwind CSS

### Opção 1: Recurso Estático
1. Fazer upload do arquivo `tailwindLWC.css` como recurso estático
2. Referenciar nos componentes LWC usando:
```javascript
import tailwindCSS from '@salesforce/resourceUrl/tailwindLWC';
```

### Opção 2: CDN (Desenvolvimento)
```html
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
```

## Personalização

### Cores da Marca
O Tailwind foi configurado com as cores da Neoenergia:
```css
--neoenergia-50: #f0f9ff;
--neoenergia-500: #0ea5e9;
--neoenergia-900: #0c4a6e;
```

### Layout Responsivo
Os componentes utilizam classes responsivas do SLDS:
- `slds-medium-size_*` para tablets
- `slds-large-size_*` para desktop

## Testes

### Testes de Unidade Apex
```bash
sfdx force:apex:test:run -c -r human
```

### Testes de Componentes LWC
```bash
npm install
npm run test:unit
```

## Manutenção

### Atualizações de Versão
1. Atualizar `apiVersion` nos arquivos `-meta.xml`
2. Testar compatibilidade com nova versão
3. Atualizar `package.xml` se necessário

### Backup
- Manter versões anteriores em controle de versão
- Criar conjuntos de alterações para rollback

## Suporte

### Problemas Comuns
1. **Permissões**: Verificar profiles e permission sets
2. **Validações**: Checar triggers e validation rules
3. **Integrações**: Validar callouts e webservices

### Logs
- Monitorar debug logs no Salesforce
- Verificar logs do navegador para LWC
- Usar Lightning Inspector para debugging

## Segurança

### Boas Práticas
- Validar todas as entradas de usuário
- Usar sharing rules apropriadas
- Implementar CRUD/FLS checks
- Evitar hardcoded IDs

### Compliance
- Seguir padrões OWASP
- Implementar rate limiting
- Usar HTTPS sempre
- Validar certificados SSL