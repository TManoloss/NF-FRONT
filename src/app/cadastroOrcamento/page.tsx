'use client'
import { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import SideBar from '../components/SideBar'; // Ajuste conforme seu caminho

const OrcamentoPage = () => {
  const [clientes, setClientes] = useState<{ value: string; label: string }[]>([]);
  const [cliente, setCliente] = useState<any>(null);
  const [endereco, setEndereco] = useState('');
  const [clientesProdutos, setClientesProdutos] = useState<{
    [key: string]: { 
      descricao: string; 
      servico: string; 
      quantidade: number; 
      data_vencimento: string; 
      produto_id: string; 
      endereco: string; 
      imagem?: string; 
      status: string;
      categoria: string;
    }[];
  }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    descricao: '',
    servico: '',
    quantidade: 0,
    data_vencimento: '',
    produto_id: '',
    endereco: '',
    imagem: null as string | null,
    status: 'Disponível',
    categoria: 'Materiais',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carrega clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5000/clientes/');
        if (!response.ok) {
          throw new Error('Erro ao buscar clientes');
        }
        const data = await response.json();
        const clientesFormatados = data.map((cliente: any) => ({
          value: cliente.id.toString(),
          label: cliente.nome,
        }));
        setClientes(clientesFormatados);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  // Salva produto no estado
  const handleSalvarProduto = () => {
    if (
      !novoProduto.descricao ||
      !novoProduto.servico ||
      !novoProduto.quantidade ||
      !novoProduto.data_vencimento ||
      !novoProduto.endereco
    ) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setError(null);

    if (cliente) {
      const clienteProduto = clientesProdutos[cliente.value] || [];
      const updatedProdutos = [...clienteProduto, { ...novoProduto, endereco }];
      setClientesProdutos({
        ...clientesProdutos,
        [cliente.value]: updatedProdutos,
      });
    }
    setModalOpen(false);
    setNovoProduto({
      descricao: '',
      servico: '',
      quantidade: 0,
      data_vencimento: '',
      produto_id: '',
      endereco: '',
      imagem: null,
      status: 'Disponível',
      categoria: 'Materiais',
    });
    setEndereco('');
    setImagePreview(null);
  };

  // Salva endereço no produto
  const handleSalvarEndereco = () => {
    setNovoProduto({ ...novoProduto, endereco });
  };

  // Exclui produto da lista
  const handleDeleteProduto = (index: number) => {
    if (cliente) {
      const updatedProdutos = clientesProdutos[cliente.value].filter((_, i) => i !== index);
      setClientesProdutos({
        ...clientesProdutos,
        [cliente.value]: updatedProdutos,
      });
    }
  };

  // Lista de produtos associados ao cliente selecionado
  const produtos = cliente ? clientesProdutos[cliente.value] || [] : [];

  // Upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovoProduto({ ...novoProduto, imagem: reader.result as string });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Salva orçamento
  const handleSalvarOrcamento = async () => {
    if (!cliente || produtos.length === 0) {
      setError('Selecione um cliente e adicione pelo menos um produto.');
      return;
    }
  
    const orcamento = {
      descricao: "Orçamento de reforma",
      servico: produtos[0].servico,
      quantidade: produtos.length,
      data_vencimento: produtos[0].data_vencimento,
      endereco: endereco,
      cliente_id: parseInt(cliente.value, 10),
      produtos: produtos.map(produto => ({
        descricao: produto.descricao,
        servico: produto.servico,
        quantidade: produto.quantidade,
        categoria: "Material",
        status: "Disponível",
      })),
    };
  
    try {
      const response = await fetch('http://localhost:5000/orcamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orcamento),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar orçamento');
      }
  
      alert('Orçamento salvo com sucesso!');
      setClientesProdutos({});
      setCliente(null);
      setEndereco('');
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      setError('Erro ao salvar orçamento.');
    }
  };

  return (
    <div className="page-container">
      {/* SideBar à esquerda */}
      <SideBar />

      {/* Conteúdo principal */}
      <div className="content-container">
        <h1 className="mb-4">Cadastro de Orçamento</h1>

        {/* Selecionar Cliente */}
        <div className="mb-4">
          <label>Cliente</label>
          <Select
            value={clientes.find((c) => c.value === cliente?.value) || null}
            onChange={(selectedOption) => setCliente(selectedOption)}
            options={clientes}
            placeholder="Selecione um cliente"
            isSearchable
          />
        </div>

        {/* Endereço */}
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

        {error && <Alert variant="danger">{error}</Alert>} 

        {/* Lista de Produtos */}
        <div className="mt-4">
          <h5>Produtos</h5>
          <div className="d-flex flex-wrap mb-4">
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="mb-3 d-flex justify-content-start"
                style={{ marginRight: '10px' }}
              >
                <div
                  className="border p-2 rounded position-relative"
                  style={{ width: '160px', height: '160px' }}
                >
                  <div>{produto.descricao}</div>
                  <div>{produto.endereco}</div>
                  {produto.imagem && (
                    <img
                      src={produto.imagem}
                      alt="Produto"
                      style={{ width: '60px', height: '60px', marginTop: '5px' }}
                    />
                  )}
                  <div
                    className="position-absolute"
                    style={{ bottom: '10px', right: '10px' }}
                  >
                    <Button
                      variant="link"
                      onClick={() => handleDeleteProduto(index)}
                      className="text-danger p-0"
                    >
                      <FaTrash size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação (sem position: fixed) */}
        <div className="action-buttons d-flex justify-content-between mt-5">
          <Button variant="success" onClick={handleSalvarOrcamento}>
            Salvar Orçamento
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Adicionar Produto
          </Button>
        </div>
      </div>

      {/* Modal de Novo Produto */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 d-flex align-items-center">
            <Button
              variant="light"
              className="me-3"
              onClick={() => document.getElementById('upload-input')?.click()}
            >
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
                <img
                  src={imagePreview}
                  alt="Imagem do Produto"
                  style={{ width: '50px', height: '50px' }}
                />
              </div>
            )}
          </div>

          <div className="mb-3">
            <label>Descrição</label>
            <InputGroup>
              <FormControl
                placeholder="Descrição"
                value={novoProduto.descricao}
                onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
              />
            </InputGroup>
          </div>

          <div className="mb-3">
            <label>Serviço</label>
            <InputGroup>
              <FormControl
                placeholder="Serviço"
                value={novoProduto.servico}
                onChange={(e) => setNovoProduto({ ...novoProduto, servico: e.target.value })}
              />
            </InputGroup>
          </div>

          <div className="mb-3">
            <label>Quantidade</label>
            <InputGroup>
              <FormControl
                type="number"
                placeholder="Quantidade"
                value={novoProduto.quantidade}
                onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: Number(e.target.value) })}
              />
            </InputGroup>
          </div>

          <div className="mb-3">
            <label>Data de Vencimento</label>
            <InputGroup>
              <FormControl
                type="date"
                placeholder="Data de Vencimento"
                value={novoProduto.data_vencimento}
                onChange={(e) => setNovoProduto({ ...novoProduto, data_vencimento: e.target.value })}
              />
            </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSalvarProduto}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .page-container {
          display: flex;
          height: 100vh;
          background: #f0f0f0;
        }

        .content-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        /* Ajuste de altura mínima para não ficar espremido em telas pequenas */
        .content-container {
          min-height: 0;
        }

        .action-buttons {
          /* Espaço extra para evitar colar nos produtos */
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default OrcamentoPage;
