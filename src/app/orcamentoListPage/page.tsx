'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface Budget {
  id: number;
  clientName: string;
  totalValue: number;
  status: string;
}

const OrcamentoListPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando dados (pode ser substituído por API)
    const mockBudgets: Budget[] = [
      { id: 1, clientName: 'Sophia', totalValue: 5000, status: 'Aprovado' },
      { id: 2, clientName: 'Manoel', totalValue: 3000, status: 'Pendente' },
      { id: 3, clientName: 'João', totalValue: 7000, status: 'Reprovado' },
    ];

    setTimeout(() => {
      setBudgets(mockBudgets);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Lista de Orçamentos</h1>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="rounded-4 overflow-hidden shadow-sm">
                <thead className="bg-dark text-white">
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
                      <td>R$ {budget.totalValue.toFixed(2)}</td>
                      <td>{budget.status}</td>
                      <td>
                        <Link href={`/orcamentos/${budget.id}`} passHref>
                          <Button variant="info" size="sm">Ver Detalhes</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
};

export default OrcamentoListPage;
