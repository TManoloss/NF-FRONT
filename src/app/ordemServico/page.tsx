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

const produtos = [
  { id: 5, descricao: 'Produto A', servico: 'Serviço A', quantidade: 10, categoria: 'Categoria A', status: 'Disponível' },
  { id: 8, descricao: 'Produto B', servico: 'Serviço B', quantidade: 5, categoria: 'Categoria B', status: 'Indisponível' },
];

const ordenServico = [
  { id: 1, descricao: 'Reforma apartamento', status: 'Produto na Oficina', numero_pedido: 12345, produto_id: 5, material_ids: [2, 3] },
  { id: 2, descricao: 'Troca de móveis', status: 'Em Produção', numero_pedido: 12346, produto_id: 8, material_ids: [3] },
];


//Lista de Materiais
const Materiais = [
  { id: 2, descricao: 'Tinta Branca', },
  { id: 3, descricao: 'Parafuso de Aço' },
];

const OrdemServicoPage = () => {
  const [ordens, setOrdens] = useState(ordenServico);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<typeof produtos[0] | null>(null);

const [modalMateriaisShow, setModalMateriaisShow] = useState(false);
const [selectedMateriais, setSelectedMateriais] = useState<typeof Materiais>([]);

  const handleStatusChange = (id: number, newStatus: string) => {
    setOrdens(ordens.map(ordem => ordem.id === id ? { ...ordem, status: newStatus } : ordem));
  };

  const handleShowDetails = (produtoId: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    setSelectedProduto(produto || null);
    setModalShow(true);
  };

  const handleShowMateriais = (materialIds: number[]) => {
    const materiaisFiltrados = Materiais.filter(m => materialIds.includes(m.id));
    setSelectedMateriais(materiaisFiltrados);
    setModalMateriaisShow(true);
  };   

  return (
    <div className="container py-4">
      <h1 className="mb-4">Ordens de Serviço</h1>
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
            onClick={() => handleShowMateriais(ordem.material_ids)}>+</Button>
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

      <Modal show={modalMateriaisShow} onHide={() => setModalMateriaisShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Materiais da Ordem de Serviço</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMateriais.length > 0 ? (
            <ul>
              {selectedMateriais.map((material: { id: number; descricao: string }) => (
                <li key={material.id}><strong>ID:</strong> {material.id} - {material.descricao}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum material associado.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: '#B71C1C', borderColor: '#B71C1C' }} onClick={() => setModalMateriaisShow(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdemServicoPage;
