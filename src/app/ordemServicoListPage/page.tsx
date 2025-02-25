'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Pagination } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface ServiceOrder {
  id: number;
  descricao: string;
  numeroPedido: string;
  clientName: string;
  status: string;
}

const ITEMS_PER_PAGE = 8;

const OrdemServicoListPage = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/ordem-servico/'); // Ajuste a URL da API conforme necessário
        const data = await response.json();

        // Mapeia e formata os dados para a interface ServiceOrder
        const formattedOrders: ServiceOrder[] = data
          .map((ordem: any) => ({
            id: ordem.id,
            descricao: ordem.descricao,
            // Utiliza o número do pedido vindo do objeto pedido ou do parâmetro "numero_pedido"
            numeroPedido: ordem.numero_pedido || '',
            // Acessa o nome do cliente aninhado em pedido.orcamento.cliente
            clientName: ordem.pedido?.orcamento?.cliente?.nome || 'Cliente Desconhecido',
            // Exibe o status vindo de pedido.status, caso esteja disponível
            status: ordem.pedido?.status || 'Status Indisponível',
          }))
          // Ordena do ID maior para o menor (mais novo para mais antigo)
          .sort((a: ServiceOrder, b: ServiceOrder) => b.id - a.id);

        setOrders(formattedOrders);
      } catch (error) {
        console.error('Erro ao buscar ordens de serviço:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Lista de Ordens de Serviço</h1>
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
                      <th>Descrição</th>
                      <th>Número do Pedido</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.descricao}</td>
                        <td>{order.numeroPedido}</td>
                        <td>{order.clientName}</td>
                        <td>{order.status}</td>
                        <td>
                          <Link href={`./ordemServico/${order.id}`} passHref>
                            <Button variant="info" size="sm">
                              Ver Detalhes
                            </Button>
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

export default OrdemServicoListPage;
