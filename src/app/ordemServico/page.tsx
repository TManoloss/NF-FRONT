'use client';

import { useState } from 'react';
import { Button, Modal, Table, Dropdown } from 'react-bootstrap';

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

// Simulating database table "Produto"
const produtos = [
  { id: 5, descricao: 'Mesa de Madeira', servico: 'Reforma', quantidade: 10, categoria: 'Móveis', status: 'Produto na Oficina' },
  { id: 8, descricao: 'Armário Planejado', servico: 'Fabricação', quantidade: 5, categoria: 'Móveis', status: 'Em Produção' },
];

// Simulating database table "Ordem de Serviço"
const ordenServico = [
  { id: 1, descricao: 'Reforma apartamento', status: 'Produto na Oficina', numero_pedido: 12345, produto_id: 5, material_id: 2 },
  { id: 2, descricao: 'Troca de moveis', status: 'Em Produção', numero_pedido: 12346, produto_id: 8, material_id: 3 },
];

const OrdemServicoPage = () => {
  const [ordens, setOrdens] = useState(ordenServico);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<typeof produtos[0] | null>(null);

  const handleStatusChange = (id: number, newStatus: string) => {
    setOrdens(ordens.map(ordem => ordem.id === id ? { ...ordem, status: newStatus } : ordem));
  };

  const handleShowDetails = (produtoId: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    setSelectedProduto(produto || null);
    setModalShow(true);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Ordens de Serviço</h1>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Descrição</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {ordens.map((ordem) => (
      <tr key={ordem.id}>
        <td>{ordem.descricao}</td>
        <td>
    <Dropdown 
        onSelect={(eventKey) => eventKey && handleStatusChange(ordem.id, eventKey)} 
        align="end">
        <Dropdown.Toggle 
            style={{ backgroundColor: '#002766', borderColor: '#002766' }} 
            variant="secondary" 
            id={`dropdown-status-${ordem.id}`}>
            {ordem.status}
        </Dropdown.Toggle>
        <Dropdown.Menu 
            flip={false} 
            rootCloseEvent="mousedown" 
            popperConfig={{ modifiers: [{ name: "preventOverflow", options: { boundary: "window" } }] }} 
            style={{ zIndex: 1050 }}>
            {statusOptions.map((status) => (
            <Dropdown.Item key={status} eventKey={status}>
                {status}
            </Dropdown.Item>
            ))}
        </Dropdown.Menu>
        </Dropdown>


        </td>
        <td>
          <Button 
            style={{ backgroundColor: '#002766', borderColor: '#002766' }} 
            onClick={() => handleShowDetails(ordem.produto_id)}>+</Button>
        </td>
      </tr>
    ))}
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
          <Button style={{ backgroundColor: '#B71C1C', borderColor: '#B71C1C' }} onClick={() => setModalShow(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdemServicoPage;
