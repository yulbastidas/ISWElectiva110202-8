//pruebas unitarias
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlatosList from './PlatosList.jsx';
import AddPlato from './AddPlato.jsx';
import EditPlato from './EditPlato.jsx';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('PlatosList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    
    axios.get.mockReturnValue(new Promise(() => {}));
  });

  it('Debe renderizar el estado de carga inicial', () => {
    render(
      <BrowserRouter>
        <PlatosList />
      </BrowserRouter>
    );
    expect(screen.getByText(/Cargando platos.../i)).toBeInTheDocument();
  });

  it('Debe cargar y renderizar la lista de platos correctamente', async () => {
    const mockPlatos = [
      { id: 1, nombre: 'Pizza', descripcion: 'Deliciosa pizza', precio: 12.99 },
      { id: 2, nombre: 'Hamburguesa', descripcion: 'Clásica hamburguesa', precio: 8.5 },
    ];
    axios.get.mockResolvedValue({ data: { platos: mockPlatos } });
    localStorageMock.getItem.mockReturnValue('usuarioPrueba');

    render(
      <BrowserRouter>
        <PlatosList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Hamburguesa')).toBeInTheDocument();
    });

    expect(screen.getByText('Deliciosa pizza')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Clásica hamburguesa')).toBeInTheDocument();
    expect(screen.getByText('$8.5')).toBeInTheDocument();
  });

  it('Debe mostrar un mensaje de error si falla la carga de platos', async () => {
    axios.get.mockRejectedValue(new Error('Error al cargar los platos'));

    render(
      <BrowserRouter>
        <PlatosList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No se pudieron cargar los platos./i)).toBeInTheDocument();
    });
  });
  

  
});