'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Pagination } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface Budget {
  id: number;
  clientName: string;
  totalValue: number;
  status: string;
  createdAt: string;
  descricao: string;
}

const ITEMS_PER_PAGE = 8; // Número de orçamentos por página

const OrcamentoListPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('http://localhost:5000/orcamentos'); // Ajuste a URL da API
        const data = await response.json();

        // Mapeando e ordenando os dados
        // Ordena do ID maior para o menor (mais novo para mais antigo)
        const formattedBudgets: Budget[] = data
  .map((orcamento: any) => ({
    id: orcamento.id,
    clientName: orcamento.cliente?.nome || "Cliente Desconhecido", // Evita erro caso o cliente não esteja definido
    descricao: orcamento.descricao, // Exibe a descrição do orçamento
    status: orcamento.data_vencimento 
      ? new Date(orcamento.data_vencimento).toLocaleDateString('pt-BR') 
      : "Data Indisponível", // Evita erro caso a data seja indefinida
  }))
  .sort((a: Budget, b: Budget) => b.id - a.id); // Tipagem explícita
      


        setBudgets(formattedBudgets);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBudgets = budgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(budgets.length / ITEMS_PER_PAGE);

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
            <>
              <div className="table-responsive">
                <Table striped bordered hover className="rounded-4 overflow-hidden shadow-sm">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Descrição</th>
                      <th>Vencimento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
  {currentBudgets.map((budget) => (
    <tr key={budget.id}>
      <td>{budget.id}</td>
      <td>{budget.clientName}</td>
      <td>{budget.descricao}</td> {/* Exibindo a descrição do orçamento */}
      <td>{budget.status}</td> {/* Exibindo a data de vencimento */}
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

              {/* Paginação */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  );
};

export default OrcamentoListPage;
