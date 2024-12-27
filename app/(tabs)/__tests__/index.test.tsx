// __tests__/App.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../index';
import { exampleMovies } from '../index'

describe('App Функциональные Тесты', () => {
  it('отображает список фильмов корректно', () => {
    const { getByText, getAllByTestId } = render(<App />);

    expect(getByText('Подбор фильмов')).toBeTruthy();

    expect(getByText('Пчеловод')).toBeTruthy();
    expect(getByText('Револьвер')).toBeTruthy();
    expect(getByText('Шальная карта')).toBeTruthy();
    expect(getByText('Большой куш')).toBeTruthy();
    expect(getByText('Перевозчик')).toBeTruthy();

    const movieItems = getAllByTestId('movie-item');
    expect(movieItems.length).toBe(5);
  });

  it('фильтрует фильмы по названию', () => {
    const { getByTestId, queryByText } = render(<App />);

    const searchInput = getByTestId('search-input');

    fireEvent.changeText(searchInput, 'Пчеловод');

    expect(queryByText('Пчеловод')).toBeTruthy();
    expect(queryByText('Револьвер')).toBeNull();
    expect(queryByText('Шальная карта')).toBeNull();
    expect(queryByText('Большой куш')).toBeNull();
    expect(queryByText('Перевозчик')).toBeNull();
  });

  it('фильтрует фильмы по жанру', () => {
    const { getByText, queryByText } = render(<App />);

    fireEvent.press(getByText('Комедия'));

    expect(queryByText('Пчеловод')).toBeNull();
    expect(queryByText('Револьвер')).toBeNull();
    expect(queryByText('Шальная карта')).toBeTruthy();
    expect(queryByText('Большой куш')).toBeTruthy();
    expect(queryByText('Перевозчик')).toBeNull();
  });

  it('сбрасывает фильтр жанра при выборе "Все"', () => {
    const { getByText, queryByText } = render(<App />);

    fireEvent.press(getByText('Комедия'));

    fireEvent.press(getByText('Все'));

    expect(queryByText('Пчеловод')).toBeTruthy();
    expect(queryByText('Револьвер')).toBeTruthy();
    expect(queryByText('Шальная карта')).toBeTruthy();
    expect(queryByText('Большой куш')).toBeTruthy();
    expect(queryByText('Перевозчик')).toBeTruthy();
  });

  it('переключает тему между светлой и тёмной', () => {
    const { getByTestId, getByText } = render(<App />);

    const switchElement = getByTestId('theme-switch'); // Добавьте testID="theme-switch" к Switch

    // Проверяем начальное состояние темы (светлая)
    expect(getByText('Подбор фильмов').props.style.color).toBe('#333');

    // Переключаем на тёмную тему
    fireEvent(switchElement, 'valueChange', true);

    // Проверяем, что цвет изменился на тёмный
    expect(getByText('Подбор фильмов').props.style.color).toBe('#fff');

    // Переключаем обратно на светлую тему
    fireEvent(switchElement, 'valueChange', false);

    // Проверяем, что цвет вернулся на светлый
    expect(getByText('Подбор фильмов').props.style.color).toBe('#333');
  });

  it('добавляет и удаляет фильм из избранного', () => {
    const { getByText, queryByText, getAllByTestId, getByTestId } = render(<App />);

    const movieItems = getAllByTestId('movie-item');

    const firstMovieItem = movieItems[0];

    // Находим кнопку "В избранное" внутри первого элемента
    const addToFavoritesButton = getByTestId(`favorite-button-${exampleMovies[0].id}`);

    fireEvent.press(addToFavoritesButton);

    expect(getByText('Удалить из избранного')).toBeTruthy();

    expect(getByText('Избранные фильмы')).toBeTruthy();

    const favoriteMovie = getByTestId(`favorite-movie-${exampleMovies[0].id}`);

    expect(favoriteMovie).toBeTruthy();

    fireEvent.press(getByText('Удалить из избранного'));

    expect(addToFavoritesButton).toBeTruthy();
  });

  it('открывает и закрывает модальное окно при нажатии на фильм', async () => {
    const { getByText, queryByText } = render(<App />);

    expect(queryByText('Закрыть')).toBeNull();

    fireEvent.press(getByText('Пчеловод'));

    expect(getByText('Закрыть')).toBeTruthy();

    fireEvent.press(getByText('Закрыть'));

    await waitFor(() => {
      expect(queryByText('Закрыть')).toBeNull();
    });
  });
});
