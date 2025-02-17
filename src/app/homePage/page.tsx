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
    <div className="container">
    
      <SideBar />

      <div className="main-content">
        <header className="header">
          <div className="user-info">
            <span className="user-name">{userName}</span>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
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
            no gerenciamento da empresa, como emissão de orçamentos, geração de pedidos,
            geração de ordens de serviço e geração de relatório.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
