'use client';

import { useState } from 'react';
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';

const OrcamentoPage = () => {
  const [cliente, setCliente] = useState<any>(null);
  const [endereco, setEndereco] = useState('');
  const [clientesPedidos, setClientesPedidos] = useState<{
    [key: string]: { descricao: string; servico: string; quantidade: number; data_vencimento: string; produto_id: string; endereco: string; imagem?: string }[];
  }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [novoPedido, setNovoPedido] = useState({
    descricao: '',
    servico: '',
    quantidade: 0,
    data_vencimento: '',
    produto_id: '',
    endereco: '',
    imagem: null as string | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const clientes = [
    { value: 'sophia', label: 'Sophia' },
    { value: 'manoel', label: 'Manoel' },
    { value: 'joao', label: 'João' },
  ];

  const handleSalvarPedido = () => {
    if (cliente) {
      const clientePedidos = clientesPedidos[cliente.value] || [];
      const updatedPedidos = [...clientePedidos, { ...novoPedido, endereco }];
      setClientesPedidos({
        ...clientesPedidos,
        [cliente.value]: updatedPedidos,
      });
    }
    setModalOpen(false);
    setNovoPedido({ descricao: '', servico: '', quantidade: 0, data_vencimento: '', produto_id: '', endereco: '', imagem: null });
    setEndereco('');
    setImagePreview(null);
  };

  const handleSalvarEndereco = () => {
    setNovoPedido({ ...novoPedido, endereco });
    console.log('Endereço salvo:', endereco);
  };

  const handleDeletePedido = (index: number) => {
    if (cliente) {
      const updatedPedidos = clientesPedidos[cliente.value].filter((_, i) => i !== index);
      setClientesPedidos({
        ...clientesPedidos,
        [cliente.value]: updatedPedidos,
      });
    }
  };

  const pedidos = cliente ? clientesPedidos[cliente.value] || [] : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovoPedido({ ...novoPedido, imagem: reader.result as string });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Cadastro de Orçamento</h1>

      <div className="mb-4">
        <label>Cliente</label>
        <Select
          value={cliente}
          onChange={(selectedOption) => setCliente(selectedOption)}
          options={clientes}
          placeholder="Selecione ou digite o nome do cliente"
          isSearchable
        />
      </div>

      <div className="mb-4">
        <label>Endereço</label>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </InputGroup>
        <div className="d-flex justify-content-end mt-2">
          <Button variant="primary" onClick={handleSalvarEndereco}>
            Salvar Endereço
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h5>Pedidos</h5>
        <div className="d-flex flex-wrap mb-4">
          {pedidos.map((pedido, index) => (
            <div key={index} className="mb-3 d-flex justify-content-start" style={{ marginRight: '10px' }}>
              <div className="border p-2 rounded position-relative" style={{ width: '120px', height: '120px' }}>
                <div>{pedido.descricao}</div>
                <div>{pedido.endereco}</div>
                {pedido.imagem && (
                  <img src={pedido.imagem} alt="Pedido" style={{ width: '50px', height: '50px', marginTop: '5px' }} />
                )}
                <div className="position-absolute" style={{ bottom: '10px', right: '10px' }}>
                  <Button variant="link" onClick={() => handleDeletePedido(index)} className="text-danger p-0">
                    <FaTrash size={20} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 d-flex align-items-center">
            <Button variant="light" className="me-3" onClick={() => document.getElementById('upload-input')?.click()}>
              <FaCloudUploadAlt size={24} />
            </Button>
            <input
              id="upload-input"
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Imagem do Pedido" style={{ width: '50px', height: '50px' }} />
              </div>
            )}
          </div>

          <div className="mb-3">
            <label>Descrição</label>
            <InputGroup>
              <FormControl
                placeholder="Descrição"
                value={novoPedido.descricao}
                onChange={(e) => setNovoPedido({ ...novoPedido, descricao: e.target.value })}
              />
            </InputGroup>
          </div>

          <div className="mb-3">
            <label>Serviço</label>
            <InputGroup>
              <FormControl
                placeholder="Serviço"
                value={novoPedido.servico}
                onChange={(e) => setNovoPedido({ ...novoPedido, servico: e.target.value })}
              />
            </InputGroup>
          </div>

          <div className="mb-3">
            <label>Quantidade</label>
            <InputGroup>
              <FormControl
                type="number"
                placeholder="Quantidade"
                value={novoPedido.quantidade}
                onChange={(e) => setNovoPedido({ ...novoPedido, quantidade: Number(e.target.value) })}
              />
            </InputGroup>
          </div>

          <div className="mb-3">
            <label>Data de Vencimento</label>
            <InputGroup>
              <FormControl
                type="date"
                placeholder="Data de Vencimento"
                value={novoPedido.data_vencimento}
                onChange={(e) => setNovoPedido({ ...novoPedido, data_vencimento: e.target.value })}
              />
            </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSalvarPedido}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Adicionar Pedido
        </Button>
      </div>
    </div>
  );
};

export default OrcamentoPage;
