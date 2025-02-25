'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Pagination } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface Funcionario {
  id: number;        // Ajuste conforme sua API
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  cpf: string;
}

const ITEMS_PER_PAGE = 8; 

const FuncionariosListPage = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await fetch('http://localhost:5000/funcionarios');
        const data = await response.json();
        setFuncionarios(data);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFuncionarios = funcionarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(funcionarios.length / ITEMS_PER_PAGE);

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Lista de Funcionários</h1>

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
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Endereço</th>
                      <th>Telefone</th>
                      <th>CPF</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFuncionarios.map((funcionario) => (
                      <tr key={funcionario.id}>
                        <td>{funcionario.id}</td>
                        <td>{funcionario.nome}</td>
                        <td>{funcionario.email}</td>
                        <td>{funcionario.endereco}</td>
                        <td>{funcionario.telefone}</td>
                        <td>{funcionario.cpf}</td>
                        <td>
                          <Link href={`/funcionarios/${funcionario.id}`} passHref>
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

export default FuncionariosListPage;
