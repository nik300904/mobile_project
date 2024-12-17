import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

// Интерфейс для описания структуры данных фильма
interface Movie {
  id: string; // Уникальный идентификатор фильма
  title: string; // Название фильма
  imageUrl: any; // Поле для локального изображения
  genre: string; // Жанр фильма
}

const App = () => {
  const [query, setQuery] = useState<string>(''); 
  const [movies, setMovies] = useState<Movie[]>([]); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); 
  const [modalVisible, setModalVisible] = useState<boolean>(false); 
  const [favorites, setFavorites] = useState<Movie[]>([]); 

  // Статичный список фильмов с локальными изображениями и жанрами
  const exampleMovies: Movie[] = [
    { id: '1', title: 'Пчеловод', imageUrl: require('../assets/images/bee.jpg'), genre: 'Драма' },
    { id: '2', title: 'Револьвер', imageUrl: require('../assets/images/revol.jpg'), genre: 'Экшн' },
    { id: '3', title: 'Шальная карта', imageUrl: require('../assets/images/card.jpg'), genre: 'Комедия' },
    { id: '4', title: 'Большой куш', imageUrl: require('../assets/images/snatch.jpg'), genre: 'Криминал' },
    { id: '5', title: 'Перевозчик', imageUrl: require('../assets/images/perevoz.jpg'), genre: 'Экшн' },
  ];

  // Эффект для инициализации списка фильмов при загрузке приложения
  useEffect(() => {
    setMovies(exampleMovies);
  }, []);

  // Функция для поиска фильмов по названию
  const searchMovies = () => {
    const filteredMovies = exampleMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setMovies(filteredMovies); 
  };

  // Функция для обработки нажатия на фильм или избранный фильм
  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie); 
    setModalVisible(true); 
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalVisible(false); 
    setSelectedMovie(null); 
  };

  // Функция для добавления/удаления фильма из избранных
  const toggleFavorite = (movie: Movie) => {
    if (favorites.includes(movie)) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id)); 
    } else {
      setFavorites([...favorites, movie]); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подбор фильмов</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Введите название фильма" 
        value={query}
        onChangeText={setQuery} 
      />
      <Button 
        title="Поиск" 
        onPress={searchMovies} 
      />
      
      {/* Список фильмов */}
      <FlatList 
        data={movies} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.movieItem}>
            <Image source={item.imageUrl} style={styles.thumbnail} /> 
            <Text>{item.title}</Text> 
            <Button 
              title={favorites.includes(item) ? "Убрать из избранного" : "Добавить в избранное"} 
              onPress={() => toggleFavorite(item)} 
            />
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
          onRequestClose={closeModal} 
        >
          <View style={styles.modalContainer}>
            <Image source={selectedMovie.imageUrl} style={styles.image} /> 
            <Button title="Закрыть" onPress={closeModal} /> 
          </View>
        </Modal>
      )}
      
      {/* Список избранных фильмов */}
      <Text style={styles.favoritesTitle}>Избранные фильмы:</Text>
      <FlatList 
        data={favorites} // Отображаем список избранных фильмов
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.favoriteItem}>
            <Text>{item.title}</Text> {/* Отображаем название избранного фильма */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Стили для компонентов приложения (оставлены без комментариев)
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
   favoritesTitle:{
     fontSize :20,
     marginTop :20,
     marginBottom :10,
   },
   favoriteItem:{
     paddingVertical :10,
     paddingHorizontal :10,
     borderBottomColor : '#ccc',
     borderBottomWidth :1,
     width:'100%',
   }
});

export default App;
