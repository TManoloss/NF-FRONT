import React from 'react'
import './SideBar.css'
import Image from 'next/image'
import Link from 'next/link'

const SideBar = () => {
  return (
    <aside className="sidebar">
        <Link href='/'>
          <div className="sidebar-logo">
            <Image src="/portorico.jpeg" alt="Uma logo Porto Rico Decorações" width={210} height={80} className='logo'/>
            <h2>Porto Rico Decorações</h2>
          </div>
        </Link>
        <nav className="sidebar-nav">
          <ul>
            <Link href='../homePage'>
            <li>
              Home
            </li>
            </Link>
            <Link href='../fornecedorListPage'>
              <li>
                Fornecedores
              </li>
            </Link>
            <Link href='../clienteListPage'>
              <li>
                Clientes 
              </li>
            </Link>
            <Link href='../funcionarioListPage'>
              <li>
                Funcionários
              </li>
            </Link>
            <Link href='../orcamentoListPage'>
              <li>
                Orçamentos
              </li>
            </Link>
            <Link href='../pedidoListPage'>
              <li>
                Pedidos                
              </li>
            </Link>
            <Link href='../ordemServicoListPage'>
              <li>
                Ordens de Serviço
              </li>
            </Link>
          </ul>
        </nav>
      </aside>
  )
}

export default SideBar