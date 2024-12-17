import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

// Интерфейс для описания структуры данных фильма
interface Movie {
  id: string;
  title: string;
  imageUrl: any;
}

const App = () => {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Статичный список фильмов с локальными изображениями
  const exampleMovies: Movie[] = [
    { id: '1', title: 'Пчеловод', imageUrl: require('../assets/images/bee.jpg') },
    { id: '2', title: 'Револьвер', imageUrl: require('../assets/images/revol.jpg') },
    { id: '3', title: 'Шальная карта', imageUrl: require('../assets/images/card.jpg') },
    { id: '4', title: 'Большой куш', imageUrl: require('../assets/images/snatch.jpg') },
    { id: '5', title: 'Перевозчик', imageUrl: require('../assets/images/perevoz.jpg') },
  ];

  // Функция для поиска фильмов по названию
  const searchMovies = () => {
    // Фильтрация фильмов по запросу
    const filteredMovies = exampleMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    setMovies(filteredMovies);
  };

  // Функция для обработки нажатия на фильм
  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подбор фильмов</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Введите название фильма" 
        value={query}
        onChangeText={setQuery} // Обновляем состояние при изменении текста в поле ввода
      />
      <Button 
        title="Поиск" 
        onPress={searchMovies} // Запускаем поиск при нажатии кнопки
      />
      <FlatList 
        data={movies.length > 0 ? movies : exampleMovies} // Если нет результатов поиска, показываем все фильмы
        keyExtractor={item => item.id} // Уникальный ключ для каждого элемента списка
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.movieItem}>
            <Image source={item.imageUrl} style={styles.thumbnail} /> {/* Отображаем изображение фильма */}
            <Text>{item.title}</Text> {/* Отображаем название фильма */}
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Модальное окно для отображения изображения выбранного фильма */}
      {selectedMovie && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal} // Закрытие модального окна при нажатии кнопки "Назад"
        >
          <View style={styles.modalContainer}>
            <Image source={selectedMovie.imageUrl} style={styles.image} /> {/* Отображаем изображение выбранного фильма */}
            <Button title="Закрыть" onPress={closeModal} /> {/* Кнопка для закрытия модального окна */}
          </View>
        </Modal>
      )}
    </View>
  );
};

// Стили для компонентов приложения
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  movieItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: 120,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  image: {
    width: 480,
    height: 620,
    aspectRatio: 16 / 9,
    marginBottom: 20,
  },
});

export default App;
