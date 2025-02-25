# Sistema de Gerenciamento de Orçamentos - Porto-Rico Decorações

Este sistema foi desenvolvido para gerenciar os orçamentos, pedidos e ordens de serviço da empresa Porto-Rico Decorações. Ele abrange desde o cadastro inicial de funcionários, clientes, fornecedores e materiais até a execução das ordens de serviço. A seguir, são descritas as principais funcionalidades do sistema e como utilizá-lo.

## Funcionalidades

### 1. Cadastro Inicial (Administrador)

O administrador pode cadastrar os seguintes dados iniciais no sistema:

- **Cadastrar Funcionário:**
    - Nome, cargo, e permissões de acesso.
  
- **Cadastrar Cliente:**
    - Nome, contato, endereço e informações relevantes do cliente.
  
- **Cadastrar Fornecedor:**
    - Nome, contato, e dados do fornecedor.
  
- **Cadastrar Material:**
    - Nome, tipo, preço e detalhes do material.

### 2. Criação de Orçamento (Administrador)

O administrador pode criar orçamentos da seguinte forma:

- **Cadastrar Orçamento:**
    - Seleciona o cliente e preenche os dados do orçamento.
  
- **Cadastrar Produto no Orçamento:**
    - Para cada produto, insere descrição, medidas e associa materiais, definindo a quantidade necessária.
  
- **Finalizar Orçamento:**
    - Revise e salva o orçamento após a inserção dos produtos.

### 3. Transformação do Orçamento em Pedido (Administrador)

O administrador pode transformar um orçamento em pedido:

- **Converter Orçamento em Pedido:**
    - Seleciona o orçamento e confirma a conversão, gerando um pedido com base nos dados inseridos.

### 4. Gerenciamento de Pedido (Administrador)

O administrador pode associar ordens de serviço aos pedidos:

- **Associar Ordem de Serviço:**
    - Seleciona o pedido e associa uma ordem de serviço, incluindo informações como data de entrega e responsável.

### 5. Execução da Ordem de Serviço (Funcionário)

O funcionário pode acompanhar e atualizar a execução das ordens de serviço:

- **Acompanhar Ordem de Serviço:**
    - Visualiza as ordens de serviço atribuídas a ele.
  
- **Atualizar Status do Produto:**
    - Marca o status do produto como "Em Produção" ou "Concluído", e adiciona observações sobre o andamento.

## Funcionalidades Adicionais

- **Consultas e Relatórios:**
    - O sistema possui telas de consulta para todas as entidades (funcionário, cliente, fornecedor, material, orçamento, pedido, ordem de serviço), permitindo a busca e visualização dos dados.
    - Geração de relatórios para orçamentos, pedidos e ordens de serviço, facilitando o controle e análise.

- **Controle de Acesso:**
    - O sistema permite a definição de diferentes níveis de permissão para administradores e funcionários, garantindo segurança e controle de acesso aos dados.

## Tecnologias Utilizadas

- **Backend:** [ ]
- **Frontend:** [Next.JS]
- **Banco de Dados:** [PostgreSQL, Prisma, Express]


### Pré-requisitos

- Banco de dados configurado.

### Passos para rodar o sistema

1. Clone o repositório
    
2. Instale as dependências:
    ```
    npm install  
    ```
3. Configure o banco de dados (detalhes de configuração).
4. Inicie o servidor:
    ```bash
    npm start  # ou o comando de inicialização do seu sistema
    ```
5. Acesse o sistema em [http://localhost:3000](http://localhost:3000).



## Licença

Este projeto está licenciado sob a Licença MIT 

