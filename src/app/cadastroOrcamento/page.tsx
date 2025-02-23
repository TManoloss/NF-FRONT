'use client'
import { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';

const OrcamentoPage = ()=> {
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

  const handleSalvarProduto = () => {
    if (!novoProduto.descricao || !novoProduto.servico || !novoProduto.quantidade || !novoProduto.data_vencimento || !novoProduto.endereco) {
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
    setNovoProduto({ descricao: '', servico: '', quantidade: 0, data_vencimento: '', produto_id: '', endereco: '', imagem: null, status: 'Disponível', categoria: 'Materiais' });
    setEndereco('');
    setImagePreview(null);
  };

  const handleSalvarEndereco = () => {
    setNovoProduto({ ...novoProduto, endereco });
    console.log('Endereço salvo:', endereco);
  };

  const handleDeleteProduto = (index: number) => {
    if (cliente) {
      const updatedProdutos = clientesProdutos[cliente.value].filter((_, i) => i !== index);
      setClientesProdutos({
        ...clientesProdutos,
        [cliente.value]: updatedProdutos,
      });
    }
  };

  const produtos = cliente ? clientesProdutos[cliente.value] || [] : [];

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
  const handleSalvarOrcamento = async () => {
    if (!cliente || produtos.length === 0) {
      setError('Selecione um cliente e adicione pelo menos um produto.');
      return;
    }
  
    const orcamento = {
      descricao: "Orçamento de reforma",
      servico: produtos[0].servico, // Pegando o primeiro serviço da lista
      quantidade: produtos.length,
      data_vencimento: produtos[0].data_vencimento, // Pegando a data do primeiro produto
      endereco: endereco,
      cliente_id: parseInt(cliente.value, 10), // Convertendo para número
      produtos: produtos.map(produto => ({
        descricao: produto.descricao,
        servico: produto.servico,
        quantidade: produto.quantidade,
        categoria: "Material", // Ajustando para o formato do curl
        status: "Disponível", // Adicionando status conforme esperado pela API
      }))
    };
  
    try {
      const response = await fetch('http://localhost:5000/orcamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="container py-4">
      <h1 className="mb-4">Cadastro de Orçamento</h1>

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

      <div className="mt-4">
        <h5>Produtos</h5>
        <div className="d-flex flex-wrap mb-4">
          {produtos.map((produto, index) => (
            <div key={index} className="mb-3 d-flex justify-content-start" style={{ marginRight: '10px' }}>
              <div className="border p-2 rounded position-relative" style={{ width: '160px', height: '160px' }}>
                <div>{produto.descricao}</div>
                <div>{produto.endereco}</div>
                {produto.imagem && (
                  <img src={produto.imagem} alt="Produto" style={{ width: '60px', height: '60px', marginTop: '5px' }} />
                )}
                <div className="position-absolute" style={{ bottom: '10px', right: '10px' }}>
                  <Button variant="link" onClick={() => handleDeleteProduto(index)} className="text-danger p-0">
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
          <Modal.Title>Novo Produto</Modal.Title>
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
                <img src={imagePreview} alt="Imagem do Produto" style={{ width: '50px', height: '50px' }} />
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

      <div style={{ position: 'fixed', bottom: '20px', right: '80px' }}>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Adicionar Produto
        </Button>
      </div>
      <div style={{ position: 'fixed', bottom: '20px', left: '85px' }}>
      <Button variant="success" onClick={handleSalvarOrcamento}>
                  Salvar Orçamento
        </Button>
      </div>
    </div>
  );
};


export default OrcamentoPage;
