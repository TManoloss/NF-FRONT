'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Pagination } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface Cliente {
  id: number;        // Se sua API não retornar 'id', remova ou ajuste.
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  cpf: string;
}

const ITEMS_PER_PAGE = 8; 

const ClientesListPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5000/clientes');
        const data = await response.json();

        // Se precisar de transformação nos dados, faça aqui. Exemplo:
        // const formatted = data.map((cliente: any) => ({
        //   id: cliente.id,
        //   nome: cliente.nome,
        //   email: cliente.email,
        //   endereco: cliente.endereco,
        //   telefone: cliente.telefone,
        //   cpf: cliente.cpf,
        // }));

        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentClientes = clientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientes.length / ITEMS_PER_PAGE);

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Lista de Clientes</h1>

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
                    {currentClientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td>{cliente.id}</td>
                        <td>{cliente.nome}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.endereco}</td>
                        <td>{cliente.telefone}</td>
                        <td>{cliente.cpf}</td>
                        <td>
                          <Link href={`/clientes/${cliente.id}`} passHref>
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

export default ClientesListPage;
