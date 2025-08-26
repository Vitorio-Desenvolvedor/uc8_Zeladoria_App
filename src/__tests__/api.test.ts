import MockAdapter from 'axios-mock-adapter';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequestConfig } from "axios";

describe('API base', () => {
  it('envia Authorization com Bearer quando há token', async () => {
    const mock = new MockAdapter(API);
    await AsyncStorage.setItem('token', 'abc123');

    mock.onGet("/alguma-rota").reply((config: AxiosRequestConfig) => {
     return [200, { message: "ok" }];
    });
    mock.onGet('/auth/users/me/').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer abc123');
      return [200, { id: 1, username: 'zelador', email: 'z@z.com' }];
    });

    const resp = await API.get('/auth/users/me/');
    expect(resp.status).toBe(200);
    expect(resp.data.username).toBe('zelador');

    mock.restore();
  });
});
