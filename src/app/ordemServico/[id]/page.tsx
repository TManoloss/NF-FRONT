'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Correto para App Router
import { Button, Modal, Table, Dropdown, Spinner } from 'react-bootstrap';

const statusOptions = [
  'Produto em Estoque',
  'Produto na Oficina',
  'Produto Finalizado',
  'Produto Aprovado',
  'Esperando Retirada',
  'Em Loja',
  'Em Desmanche',
  'Em Produção',
  'Em Empacotamento',
  'Entregue'
];

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

interface Produto {
  id: number;
  descricao: string;
  servico: string;
  quantidade: number;
  categoria: string;
  status: string;
  orcamento_id: number;
  materiais: any[]; // Ajuste conforme necessário
}

interface Pedido {
  id: number;
  numero: string;
  status: string;
  data_criacao: string;
  orcamento_id: number;
  orcamento: Orcamento;
}

interface OrdemServico {
  id: number;
  descricao: string;
  numero_pedido: number;
  pedido: Pedido;
  produtos: Produto[];
}

interface Material {
  id: number;
  descricao: string;
  quantidade: number;
}

const OrdemServicoPage = () => {
  const { id } = useParams(); // Obtendo o ID corretamente no App Router
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [modalMateriaisShow, setModalMateriaisShow] = useState(false);
  const [selectedMateriais, setSelectedMateriais] = useState<Material[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/ordem-servico/${id}`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status}`);
        }

        const data = await response.json();
        setOrdem(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ordem) return;

    try {
      const response = await fetch(`http://localhost:5000/ordem-servico/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar status: ${response.status}`);
      }

      setOrdem({ ...ordem, pedido: { ...ordem.pedido, status: newStatus } });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleShowDetails = (produto: Produto) => {
    setSelectedProduto(produto);
    setModalShow(true);
  };

  const handleShowMateriais = (materiais: any[]) => {
    setSelectedMateriais(materiais);
    setModalMateriaisShow(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!ordem) {
    return <p>Ordem de serviço não encontrada.</p>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Ordem de Serviço</h1>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Status</th>
            <th>Materiais</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ordem && ordem.produtos && Array.isArray(ordem.produtos) && ordem.produtos.length > 0 ? (
            ordem.produtos.map((produto, index) => (
              <tr key={produto.id}>
                <td>{produto.descricao || 'Descrição não disponível'}</td>
                <td>
                  <Dropdown onSelect={eventKey => eventKey && handleStatusChange(eventKey)}>
                    <Dropdown.Toggle variant="secondary">{ordem.pedido.status}</Dropdown.Toggle>
                    <Dropdown.Menu>
                      {statusOptions.map(status => (
                        <Dropdown.Item key={status} eventKey={status}>{status}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Button onClick={() => handleShowMateriais(produto.materiais)}>+</Button>
                </td>
                <td>
                  <Button onClick={() => handleShowDetails(produto)}>+</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Nenhum produto disponível.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduto ? (
            <div>
              <p><strong>ID:</strong> {selectedProduto.id}</p>
              <p><strong>Descrição:</strong> {selectedProduto.descricao}</p>
              <p><strong>Serviço:</strong> {selectedProduto.servico}</p>
              <p><strong>Quantidade:</strong> {selectedProduto.quantidade}</p>
              <p><strong>Categoria:</strong> {selectedProduto.categoria || 'Não especificada'}</p>
              <p><strong>Status:</strong> {selectedProduto.status}</p>
            </div>
          ) : (
            <p>Produto não encontrado.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalMateriaisShow} onHide={() => setModalMateriaisShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Materiais do Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMateriais.length > 0 ? (
            <ul>
              {selectedMateriais.map(material => (
                <li key={material.id}>{`ID: ${material.id}, Quantidade: ${material.quantidade}`}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum material associado.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalMateriaisShow(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdemServicoPage;
