import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios globalmente
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { platos: [] } })),
    post: vi.fn(() => Promise.resolve({ data: { success: true } })),
  },
}));

// Mockear TODOS los componentes hijos que App renderiza a través de sus rutas.
vi.mock('./components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Mock Navbar</nav>,
}));
vi.mock('./components/PlatosList', () => ({
  default: () => <div data-testid="platos-list">Mock Platos List</div>,
}));
vi.mock('./components/Login', () => ({
  default: () => <div data-testid="login"><button>Iniciar Sesión</button></div>,
}));
vi.mock('./components/Register', () => ({
  default: () => <div data-testid="register"><p>Registrarse</p></div>,
}));
vi.mock('./components/PasswordReset', () => ({
  default: () => <div data-testid="password-reset"><p>Recuperar contraseña</p></div>,
}));
vi.mock('./components/PasswordVerify', () => ({
  default: () => <div data-testid="password-verify"><p>Verifica tu código</p></div>,
}));
vi.mock('./components/Menu', () => ({
    default: () => <div data-testid="menu">Mock Menu Component</div>,
}));
vi.mock('./components/CarritoCompras', () => ({
    default: () => <div data-testid="carrito">Mock Carrito Compras Component</div>,
}));
vi.mock('./components/PedidoConfirmado', () => ({
    default: () => <div data-testid="pedido-confirmado">Mock Pedido Confirmado Component</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Test 1: El componente Login se renderiza en la ruta raíz.
  test('renders the Login component on the root path', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const loginButton = await screen.findByRole('button', { name: /Iniciar Sesión/i });
    expect(loginButton).toBeInTheDocument();
  });

  // Test 2: El componente Register se renderiza en la ruta /register.
  test('renders the Register component on the /register path', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    const registerText = await screen.findByText(/Registrarse/i);
    expect(registerText).toBeInTheDocument();
  });

  // Test 3: El componente PasswordReset se renderiza en su ruta.
  test('renders the PasswordReset component on the /password-reset path', async () => {
    render(
      <MemoryRouter initialEntries={['/password-reset']}>
        <App />
      </MemoryRouter>
    );
    
    const passwordResetText = await screen.findByText(/Recuperar contraseña/i);
    expect(passwordResetText).toBeInTheDocument();
  });

  // Test 4: El componente PasswordVerify se renderiza en su ruta.
  test('renders the PasswordVerify component on the /password-verify path', async () => {
    render(
      <MemoryRouter initialEntries={['/password-verify']}>
        <App />
      </MemoryRouter>
    );
    
    const passwordVerifyText = await screen.findByText(/Verifica tu código/i);
    expect(passwordVerifyText).toBeInTheDocument();
  });

  // Test 5: Redirección de /login a /
  test('redirects from /login to /', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    const loginButton = await screen.findByRole('button', { name: /Iniciar Sesión/i });
    expect(loginButton).toBeInTheDocument();
  });
});