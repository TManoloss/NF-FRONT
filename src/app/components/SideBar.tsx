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
            <li>
              Fornecedores
            </li>
            <li>
              Clientes 
            </li>
            <li>
              Funcionários
            </li>
            <li>
              Orçamentos
            </li>
            <li>
              Pedidos                
            </li>
            <li>
              Ordens de Serviço
            </li>
          </ul>
        </nav>
      </aside>
  )
}

export default SideBar