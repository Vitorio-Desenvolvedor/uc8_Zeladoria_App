import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { AuthProvider } from '../context/AuthContext';
import MockAdapter from 'axios-mock-adapter';
import API from '../../api/api';

const Wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;

describe('HomeScreen', () => {
  it('exibe salas retornadas pela API', async () => {
    const mock = new MockAdapter(API);
    // Simula usuário já logado
    mock.onGet('/auth/users/me/').reply(200, { id: 1, username: 'ana', email: 'a@a.com' });
    mock.onGet('/api/salas/').reply(200, [
      { id: 1, nome: 'Sala 101', localizacao: 'Bloco A' },
      { id: 2, nome: 'Sala 202', localizacao: 'Bloco B' },
    ]);

    const screen = render(<HomeScreen navigation={{ navigate: jest.fn() }} />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.queryByText(/Sala 101/i)).toBeTruthy();
      expect(screen.queryByText(/Sala 202/i)).toBeTruthy();
    });

    mock.restore();
  });
});
