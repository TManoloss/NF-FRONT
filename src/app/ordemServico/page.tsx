'use client';

import { useState, useEffect } from 'react';
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

interface OrdemServico {
  id: number;
  descricao: string;
  status: string;
  numero_pedido: number;
  produto_id: number;
  material_ids: number[];
}

interface Produto {
  id: number;
  descricao: string;
  servico: string;
  quantidade: number;
  categoria: string;
  status: string;
}

interface Material {
  id: number;
  descricao: string;
}

const OrdemServicoPage = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [modalMateriaisShow, setModalMateriaisShow] = useState(false);
  const [selectedMateriais, setSelectedMateriais] = useState<Material[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordensRes = await fetch('http://localhost:5000/ordens');
        const produtosRes = await fetch('http://localhost:5000/produtos');
        const materiaisRes = await fetch('http://localhost:5000/materiais');

        const ordensData = await ordensRes.json();
        const produtosData = await produtosRes.json();
        const materiaisData = await materiaisRes.json();

        setOrdens(ordensData);
        setProdutos(produtosData);
        setMateriais(materiaisData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch(`http://localhost:5000/ordens/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrdens(ordens.map(ordem => (ordem.id === id ? { ...ordem, status: newStatus } : ordem)));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleShowDetails = (produtoId: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    setSelectedProduto(produto || null);
    setModalShow(true);
  };

  const handleShowMateriais = (materialIds: number[]) => {
    const materiaisFiltrados = materiais.filter(m => materialIds.includes(m.id));
    setSelectedMateriais(materiaisFiltrados);
    setModalMateriaisShow(true);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Ordens de Serviço</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : (
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
            {ordens.map(ordem => (
              <tr key={ordem.id}>
                <td>{ordem.descricao}</td>
                <td>
                  <Dropdown onSelect={eventKey => eventKey && handleStatusChange(ordem.id, eventKey)}>
                    <Dropdown.Toggle variant="secondary">{ordem.status}</Dropdown.Toggle>
                    <Dropdown.Menu>
                      {statusOptions.map(status => (
                        <Dropdown.Item key={status} eventKey={status}>{status}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Button onClick={() => handleShowMateriais(ordem.material_ids)}>+</Button>
                </td>
                <td>
                  <Button onClick={() => handleShowDetails(ordem.produto_id)}>+</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
          <Modal.Title>Materiais da Ordem de Serviço</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMateriais.length > 0 ? (
            <ul>
              {selectedMateriais.map(material => (
                <li key={material.id}>{material.descricao}</li>
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
