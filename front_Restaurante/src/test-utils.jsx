import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-exporta todo de @testing-library/react para que no tengas que cambiar tus importaciones existentes
export * from '@testing-library/react';

// Sobreescribe la función 'render' con nuestra versión personalizada
export { customRender as render };