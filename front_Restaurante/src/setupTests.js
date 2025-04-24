// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Hacer que 'jest' sea un alias de 'vi'
global.jest = vi;