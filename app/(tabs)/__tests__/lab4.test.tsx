import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MediaScreen from '../lab4';


jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn((module) => ({ uri: module })),
  },
}));


jest.mock('expo-av', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Video: (props) => <View {...props} />, // Замокированный компонент Video
    Audio: {
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({
            sound: {
              playAsync: jest.fn(),
              stopAsync: jest.fn(),
            },
          })
        ),
      },
    },
  };
});


describe('MediaScreen', () => {
  it('renders the list of movies correctly', () => {
    const { getByText, getAllByTestId } = render(<MediaScreen />);

    expect(getByText('🎥 Подбор фильмов')).toBeTruthy();

    expect(getByText('Пчеловод')).toBeTruthy();
    expect(getByText('Револьвер')).toBeTruthy();

    const movieItems = getAllByTestId('movie-item');
    expect(movieItems.length).toBe(2);
  });

  it('opens modal when a movie is pressed', () => {
    const { getByText, queryByText } = render(<MediaScreen />);

    // Модальное окно должно быть закрыто
    expect(queryByText('🎬 Трейлер:')).toBeNull();

    fireEvent.press(getByText('Пчеловод'));

    // Модальное окно должно быть открыто
    expect(getByText('🎬 Трейлер:')).toBeTruthy();
    expect(getByText('🎵 Аудиофрагмент:')).toBeTruthy();
  });

  it('closes modal when the close button is pressed', async () => {
    const { getByText, queryByText } = render(<MediaScreen />);

    fireEvent.press(getByText('Пчеловод'));

    expect(getByText('🎬 Трейлер:')).toBeTruthy();

    fireEvent.press(getByText('Закрыть'));

    await waitFor(() => expect(queryByText('🎬 Трейлер:')).toBeNull());
  });
});
