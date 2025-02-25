'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Button, Spinner, Card, ListGroup } from 'react-bootstrap';
import SideBar from '@/app/components/SideBar';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
}

interface Orcamento {
  id: number;
  descricao: string;
  servico: string;
  quantidade: number;
  data_vencimento: string;
  endereco: string;
  cliente_id: number;
  cliente: Cliente;
}

interface Material {
  id: number;
  produtoId: number;
  materialId: number;
  quantidade: number;
}

interface ProdutoDetails {
  id: number;
  descricao: string;
  servico: string;
  quantidade: number;
  categoria: string;
  status: string;
  orcamento_id: number;
  materiais: Material[];
}

interface PedidoProduto {
  id: number;
  pedidoId: number;
  produtoId: number;
  ordemServicoId: number;
  status: string;
  produto: ProdutoDetails;
}

interface PedidoDetail {
  id: number;
  numero: string;
  status: string;
  data_criacao: string;
  orcamento_id: number;
  orcamento: Orcamento;
  produtos: PedidoProduto[];
}

const PedidoDetalhesPage = () => {
  const params = useParams();
  const id = params.id as string; // Pegando o ID corretamente como string
  const [pedido, setPedido] = useState<PedidoDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const fetchPedido = async () => {
        try {
          const response = await fetch(`http://localhost:5000/pedidos/${id}`);
          const contentType = response.headers.get('content-type');
          const text = await response.text();

          console.log('Headers da resposta:', contentType);
          console.log('Resposta bruta:', text);

          if (!response.ok) {
            throw new Error(`Erro ao buscar pedido: ${response.status}`);
          }

          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('A resposta não está no formato JSON.');
          }

          setPedido(JSON.parse(text));
        } catch (error) {
          console.error('Erro ao buscar pedido:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPedido();
    }
  }, [id]);

  const handleGenerateOrdemServico = async () => {
    if (!pedido) return;
    setGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/ordem-servico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: pedido.id }),
      });

      if (response.ok) {
        alert('Ordem de serviço gerada com sucesso!');
      } else {
        alert('Erro ao gerar ordem de serviço.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar ordem de serviço.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!pedido) {
    return <p>Pedido não encontrado.</p>;
  }

  return (
    <div className="d-flex">
      <SideBar />
      <main className="flex-grow-1">
        <Container className="py-4">
          <h1 className="mb-4">Detalhes do Pedido</h1>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Pedido Nº: {pedido.numero}</Card.Title>
              <Card.Text>
                <strong>Status:</strong> {pedido.status}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Orçamento</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Descrição:</strong> {pedido.orcamento.descricao}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Serviço:</strong> {pedido.orcamento.servico}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Quantidade:</strong> {pedido.orcamento.quantidade}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Endereço:</strong> {pedido.orcamento.endereco}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Cliente:</strong> {pedido.orcamento.cliente.nome}
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card className="mb-4">
            <Card.Header>Produtos</Card.Header>
            <ListGroup variant="flush">
              {pedido.produtos.map((item) => (
                <ListGroup.Item key={item.id}>
                  <strong>Produto:</strong> {item.produto.descricao} — <strong>Serviço:</strong>{' '}
                  {item.produto.servico} — <strong>Quantidade:</strong> {item.produto.quantidade} —{' '}
                  <strong>Status:</strong> {item.status}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          <Button
            variant="primary"
            onClick={handleGenerateOrdemServico}
            disabled={generating}
          >
            {generating ? 'Gerando Ordem de Serviço...' : 'Gerar Ordem de Serviço'}
          </Button>
        </Container>
      </main>
    </div>
  );
};

export default PedidoDetalhesPage;
