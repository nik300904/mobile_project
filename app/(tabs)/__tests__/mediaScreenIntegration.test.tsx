// mediaScreenIntegration.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Определяем мок-функции
const mockPlayAsync = jest.fn();
const mockStopAsync = jest.fn();

// Мокирование expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn((module) => ({ uri: module })),
  },
}));

// Мокирование expo-av
jest.mock('expo-av', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Audio: {
      Sound: jest.fn().mockImplementation(() => ({
        playAsync: mockPlayAsync,
        stopAsync: mockStopAsync,
      })),
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: mockPlayAsync,
            stopAsync: mockStopAsync,
          },
        })
      ),
    },
    Video: (props) => <View {...props} />, // Мокированный компонент Video
  };
});

// Теперь импортируем компонент после мокирования
import MediaScreen from '../lab4';

describe('MediaScreen Media Interaction', () => {
  beforeEach(() => {
    // Очищаем все мок-функции перед каждым тестом
    jest.clearAllMocks();
  });

  it('plays audio when the button is pressed', async () => {
    const { getByText } = render(<MediaScreen />);

    // Нажимаем на фильм "Пчеловод"
    fireEvent.press(getByText('Пчеловод'));

    // Нажимаем на кнопку "Воспроизвести аудио"
    fireEvent.press(getByText('Воспроизвести аудио'));
  });
});
