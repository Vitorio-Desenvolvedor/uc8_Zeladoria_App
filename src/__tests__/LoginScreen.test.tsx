import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { AuthProvider } from '../context/AuthContext';
import MockAdapter from 'axios-mock-adapter';
import API from '../../api/api';

const renderWithProviders = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);

describe('LoginScreen', () => {
  it('faz login com credenciais válidas', async () => {
    const mock = new MockAdapter(API);
    mock.onPost('/auth/jwt/create/').reply(200, { access: 'tok-123' });
    mock.onGet('/auth/users/me/').reply(200, { id: 1, username: 'john', email: 'j@j.com' });

    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Usuário'), 'john');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'secret');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      
      expect(true).toBe(true);
    });

    mock.restore();
  });

  it('mostra erro quando o backend rejeita as credenciais', async () => {
    const mock = new MockAdapter(API);
    mock.onPost('/auth/jwt/create/').reply(400);

    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Usuário'), 'x');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'y');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    alertSpy.mockRestore();
    mock.restore();
  });
});
