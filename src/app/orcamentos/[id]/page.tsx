'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Spinner, Button, Card, Table } from 'react-bootstrap';
import Link from 'next/link';
import SideBar from '@/app/components/SideBar';

interface Produto {
  id: number;
  descricao: string;
  servico: string;
  quantidade: number;
  categoria: string;
  status: string;
  orcamento_id: number;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
}

interface BudgetDetail {
  id: number;
  descricao: string;
  servico: string;
  quantidade: number;
  data_vencimento: string;
  endereco: string;
  cliente_id: number;
  produtos: Produto[];
  cliente: Cliente;
}

const OrcamentoDetailPage = () => {
  // Recupera o parâmetro de rota (id do orçamento)
  const { id } = useParams();
  const [budget, setBudget] = useState<BudgetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const fetchBudgetDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/orcamentos/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar os detalhes do orçamento.');
        }
        const data = await response.json();
        setBudget(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetDetail();
  }, [id]);

  // Função para gerar o pedido a partir do orçamento
  const handleGenerateOrder = async () => {
    if (!budget) return;

    try {
      const response = await fetch('http://localhost:5000/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orcamento_id: budget.id }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar o pedido.');
      }

      // Aqui você pode implementar uma lógica adicional (ex: redirecionar, exibir mensagem de sucesso, etc.)
      alert('Pedido gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar o pedido:', error);
      alert('Erro ao gerar o pedido.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <h1>Detalhes do Orçamento</h1>
        <p className="text-danger">{error}</p>
        <Link href="/orcamentos">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </Container>
    );
  }

  if (!budget) {
    return (
      <Container className="py-4">
        <h1>Detalhes do Orçamento</h1>
        <p>Orçamento não encontrado.</p>
        <Link href="/orcamentos">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </Container>
    );
  }

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Detalhes do Orçamento</h1>

          {/* Card com dados do orçamento */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Orçamento #{budget.id}</Card.Title>
              <Card.Text>
                <strong>Descrição:</strong> {budget.descricao} <br />
                <strong>Serviço:</strong> {budget.servico} <br />
                <strong>Quantidade:</strong> {budget.quantidade} <br />
                <strong>Data de Vencimento:</strong>{' '}
                {new Date(budget.data_vencimento).toLocaleDateString('pt-BR')} <br />
                <strong>Endereço:</strong> {budget.endereco} <br />
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Card com dados do cliente */}
          <Card className="mb-4">
            <Card.Header>Detalhes do Cliente</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Nome:</strong> {budget.cliente.nome} <br />
                <strong>Email:</strong> {budget.cliente.email} <br />
                <strong>Telefone:</strong> {budget.cliente.telefone} <br />
                <strong>Endereço:</strong> {budget.cliente.endereco} <br />
                <strong>CPF:</strong> {budget.cliente.cpf} <br />
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Tabela com os produtos */}
          <Card className="mb-4">
            <Card.Header>Produtos</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead className="bg-dark text-white">
                  <tr>
                    <th>ID</th>
                    <th>Descrição</th>
                    <th>Serviço</th>
                    <th>Quantidade</th>
                    <th>Categoria</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.produtos.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.id}</td>
                      <td>{produto.descricao}</td>
                      <td>{produto.servico}</td>
                      <td>{produto.quantidade}</td>
                      <td>{produto.categoria}</td>
                      <td>{produto.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Botão para gerar o pedido */}
          <div className="d-flex gap-2 mb-4">
            <Button variant="primary" onClick={handleGenerateOrder}>
              Gerar Pedido
            </Button>
            <Link href="/orcamentos">
              <Button variant="secondary">Voltar</Button>
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default OrcamentoDetailPage;
