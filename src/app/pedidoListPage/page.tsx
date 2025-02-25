'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Pagination } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface Pedido {
  id: number;
  clienteNome: string;
  dataPedido: string;
  valorTotal: number;
  status: string;
}

const ITEMS_PER_PAGE = 8;

const PedidoListPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Ajuste a URL da sua API de Pedidos
        const response = await fetch('http://localhost:5000/pedidos');
        const data = await response.json();

        // Se precisar transformar dados, faça aqui
        // Exemplo:
        // const formattedData = data.map((pedido: any) => ({
        //   id: pedido.id,
        //   clienteNome: pedido.cliente?.nome ?? 'Cliente Desconhecido',
        //   dataPedido: pedido.dataPedido,
        //   valorTotal: pedido.valorTotal,
        //   status: pedido.status,
        // }));
        // setPedidos(formattedData);

        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPedidos = pedidos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pedidos.length / ITEMS_PER_PAGE);

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Lista de Pedidos</h1>

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
                      <th>Data do Pedido</th>
                      <th>Valor Total</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{pedido.clienteNome}</td>
                        <td>{pedido.dataPedido}</td>
                        <td>{pedido.valorTotal}</td>
                        <td>{pedido.status}</td>
                        <td>
                          {/* Ajuste a rota de detalhes conforme sua necessidade */}
                          <Link href={`/pedidos/${pedido.id}`} passHref>
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

export default PedidoListPage;
