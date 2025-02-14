'use client';

import { useState } from 'react';

const CadastroPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    cpf: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    
    try {
        const response = await fetch('http://localhost:5000/api/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar funcionário');
        }

        const data = await response.json();
        console.log('Funcionário cadastrado com sucesso:', data);
    } catch (error) {
        console.error('Erro:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Cadastro de Clientes</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} required />
            <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
            <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
          </div>
          <button type="submit">Cadastrar</button>
        </form>
      </div>
      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f0f0f0; /* Cinza claro para combinar com o branco do formulário */
        }

        .form-container {
          max-width: 450px;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        .input-group {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .input-group input[name="cpf"] {
          width: 100%; /* CPF ocupa a linha inteira */
        }

        input {
          flex: 1;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #0070f3, #005bb5);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease-in-out, transform 0.2s ease;
        } 

        button:hover {
          background: linear-gradient(135deg, #003d99, #002766);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default CadastroPage;
