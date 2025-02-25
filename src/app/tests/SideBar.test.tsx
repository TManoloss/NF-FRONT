// SideBar.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideBar from '../components/SideBar';

describe('SideBar', () => {
  test('deve renderizar corretamente a logo e os links de navegação', () => {
    render(<SideBar />);

    // Verifica se a imagem da logo está presente pelo alt text
    const logo = screen.getByAltText('Uma logo Porto Rico Decorações');
    expect(logo).toBeInTheDocument();

    // Verifica se o título está presente
    const title = screen.getByText('Porto Rico Decorações');
    expect(title).toBeInTheDocument();

    // Lista de textos que devem estar presentes nos links
    const navLinks: string[] = [
      'Fornecedores',
      'Clientes',
      'Funcionários',
      'Orçamentos',
      'Pedidos',
      'Ordens de Serviço'
    ];

    navLinks.forEach((text) => {
      const linkElement = screen.getByText(text);
      expect(linkElement).toBeInTheDocument();
    });
  });
});
