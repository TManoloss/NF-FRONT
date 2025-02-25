'use client';

import React from 'react';
import './HomePage.css';
import SideBar from '../components/SideBar';

interface HomePageProps {
  userName: string;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ userName, onLogout }) => {
  return (
    <div className="d-flex">
      <SideBar />
      <div className="main-content">
        <header className="header">
          <div className="user-info">
            <span className="user-name">{userName}</span>
          </div>
          {/* <button className="logout-button" onClick={() => {
            onLogout();
            window.location.href = '/login';
          }}>
            Logout
          </button> */}
        </header>

        <main className="main-section">
          <div className="main-box">
            <h1>Principais funcionalidades</h1>
            <p>
              O sistema de gerenciamento da empresa Porto Rico - especializado na
              reforma de estofados - pretende ser um sistema de gerenciamento, para que se
              possa controlar contatos, pedidos, relatórios e orçamentos. Fornecendo um
              aplicativo de gerenciamento que permite o cadastro de clientes, fornecedores e
              produtos. Além disso, o sistema possui funcionalidades que auxiliam o administrador
              no gerenciamento da empresa, como emissão de orçamentos, geração de pedidos e
              geração de ordens de serviço.
            </p>
          </div>

          {/* Seção de Acesso Rápido para Cadastro */}
          <div className="quick-access-section">
            <h2>Acesso Rápido para Cadastro</h2>
            <div className="quick-access-buttons">
              <button onClick={() => window.location.href = '/cadastroFornecedores'}>
                Fornecedores
              </button>
              <button onClick={() => window.location.href = '/cadastroClientes'}>
                Clientes
              </button>
              <button onClick={() => window.location.href = '/cadastroFuncionarios'}>
                Funcionários
              </button>
              <button onClick={() => window.location.href = '/cadastroOrcamento'}>
                Orçamentos
              </button>
              <button onClick={() => window.location.href = '/cadastroMateriais'}>
                Materiais
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
