import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import PlatosList from './components/PlatosList.jsx';
import Navbar from './components/Navbar.jsx';
import PasswordReset from './components/PasswordReset.jsx';
import PasswordVerify from './components/PasswordVerify.jsx';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('App Component', () => {
  test('renders the Navbar component', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders the Login component on the root path', () => {
    render(<App />);
    // Usamos getByRole para ser más específicos con el botón de inicio de sesión
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  test('renders the Register component on the /register path', () => {
    window.history.pushState({}, '', '/register');
    render(<App />);
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  test('renders the PlatosList component on the /platos path', async () => {
    const mockPlatos = {
      data: {
        platos: [
          { id: 1, nombre: 'Pizza Margherita', precio: 10, descripcion: 'Deliciosa pizza con tomate y mozzarella' },
          { id: 2, nombre: 'Pasta Carbonara', precio: 12, descripcion: 'Clásica pasta con huevo, queso y panceta' },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockPlatos);

    window.history.pushState({}, '', '/platos');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Pizza Margherita/i)).toBeInTheDocument();
      expect(screen.getByText(/Pasta Carbonara/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/restaurante/');
  });

  test('renders the PasswordReset component on the /password-reset path', () => {
    window.history.pushState({}, '', '/password-reset');
    render(<App />);
    expect(screen.getByText(/Recuperar contraseña/i)).toBeInTheDocument();
  });

  test('renders the PasswordVerify component on the /password-verify path', () => {
    window.history.pushState({}, '', '/password-verify');
    render(<App />);
    expect(screen.getByText(/Verifica tu código/i)).toBeInTheDocument();
  });
});