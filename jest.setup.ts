import '@testing-library/jest-native/extend-expect';
import 'whatwg-fetch';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de react-native-reanimated (evita erros no Jest)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock de Navigation (se necessário)
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  };
});
