'use client';

import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '../components/SideBar';

interface Budget {
  id: number;
  clientName: string;
  totalValue: number;
  status: string;
}

const budgets: Budget[] = [
  { id: 1, clientName: 'Sophia', totalValue: 5000, status: 'Aprovado' },
  { id: 2, clientName: 'Manoel', totalValue: 3000, status: 'Pendente' },
  { id: 3, clientName: 'João', totalValue: 7000, status: 'Reprovado' },
];

const OrcamentosListPage: React.FC = () => {
  return (
    <div className="d-flex">
      {/* Sidebar à esquerda */}
      <SideBar />

      {/* Conteúdo principal */}
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Lista de Orçamentos</h1>

          <Table striped bordered hover responsive className='rounded-full'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.id}</td>
                  <td>{budget.clientName}</td>
                  <td>{budget.totalValue}</td>
                  <td>{budget.status}</td>
                  <td>
                    <Link href={`/orcamentos/${budget.id}`}>
                      <Button variant="primary" size="sm">
                        Detalhes
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end mt-4">
            <Link href="../cadastroOrcamento">
              <Button variant="success">Cadastrar Novo Orçamento</Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default OrcamentosListPage;

