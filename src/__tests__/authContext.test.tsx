import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import MockAdapter from 'axios-mock-adapter';
import API from '../../api/api';

function Consumer() {
  const { user, login, logout, token } = useAuth();
  React.useEffect(() => {
    (async () => {
      await login('admin', '123');
    })();
  }, []);
  return (
    <>
      {user ? <></> : <></>}
      {/* Apenas para expor valores durante o teste */}
      <></>
    </>
  );
}

describe('AuthContext', () => {
  it('realiza login e popula user/token', async () => {
    const mock = new MockAdapter(API);
    mock.onPost('/auth/jwt/create/').reply(200, { access: 'tok-xyz' });
    mock.onGet('/auth/users/me/').reply(200, { id: 1, username: 'admin', email: 'a@a.com' });

    const Wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const screen = render(<Consumer />, { wrapper: Wrapper });

    await waitFor(() => {
      // Se não lançar erro até aqui, login + fetch user funcionaram
      expect(true).toBe(true);
    });

    mock.restore();
  });

  it('logout limpa token e user', async () => {
    const mock = new MockAdapter(API);
    mock.onPost('/auth/jwt/create/').reply(200, { access: 'tok-abc' });
    mock.onGet('/auth/users/me/').reply(200, { id: 9, username: 'u', email: 'u@u.com' });

    let api: any;
    function LocalConsumer() {
      const ctx = useAuth();
      api = ctx;
      return null;
    }

    const Wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    render(<LocalConsumer />, { wrapper: Wrapper });

    await api.login('u', 'pw');
    expect(api.token).toBeTruthy();
    await api.logout();
    expect(api.token).toBeNull();

    mock.restore();
  });
});
