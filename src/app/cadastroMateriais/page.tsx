'use client';

import { useState } from 'react';

const CadastrarMateriais = () => {
  const [formData, setFormData] = useState({
    descricao: '',
    fornecedor_id: '',
    produto_destino: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/materiais', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descricao: formData.descricao,
        produto: Number(formData.produto_destino),
        fornecedorId: Number(formData.fornecedor_id),
      }),
    });
    
    if (response.ok) {
      console.log('Dados enviados com sucesso');
    } else {
      console.error('Erro ao enviar dados');
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Cadastro de Materiais</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="number" name="fornecedor_id" placeholder="ID do Fornecedor" value={formData.fornecedor_id} onChange={handleChange} required />
            <input type="number" name="produto_destino" placeholder="ID do Produto Destino" value={formData.produto_destino} onChange={handleChange} />
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
          background: #f0f0f0;
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

export default CadastrarMateriais;