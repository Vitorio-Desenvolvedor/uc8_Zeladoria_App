import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HistoricoLimpezasScreen from '../screens/HistoricoLimpezasScreen';
import { AuthProvider } from '../context/AuthContext';
import MockAdapter from 'axios-mock-adapter';
import API from '../../api/api';

const Wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;

describe('HistoricoLimpezasScreen', () => {
  it('lista registros de limpeza', async () => {
    const mock = new MockAdapter(API);
    mock.onGet('/auth/users/me/').reply(200, { id: 7, username: 'joao', email: 'j@j.com' });
    mock.onGet('/api/historico/').reply(200, [
      { id: 1, sala: { nome: '101' }, data: '2025-08-20', status: 'CONCLUIDO', observacao: 'OK' },
      { id: 2, sala: { nome: '202' }, data: '2025-08-21', status: 'PENDENTE' },
    ]);

    const screen = render(<HistoricoLimpezasScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.queryByText(/Sala: 101/i)).toBeTruthy();
      expect(screen.queryByText(/Status: CONCLUIDO/i)).toBeTruthy();
      expect(screen.queryByText(/Obs: OK/i)).toBeTruthy();
    });

    mock.restore();
  });
});
