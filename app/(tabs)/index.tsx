import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';

interface Movie {
  id: number;
  title: string;
  imageUrl: any; // Используем `any` для поддержки динамического импорта изображений с использованием `require`
  genre: string;
}

const App = () => {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Состояние для переключения темы

  const exampleMovies: Movie[] = [
    { id: 1, title: 'Пчеловод', imageUrl: require('../../assets/images/bee.jpg'), genre: 'Драма' },
    { id: 2, title: 'Револьвер', imageUrl: require('../../assets/images/revol.jpg'), genre: 'Экшн' },
    { id: 3, title: 'Шальная карта', imageUrl: require('../../assets/images/card.jpg'), genre: 'Комедия' },
    { id: 4, title: 'Большой куш', imageUrl: require('../../assets/images/snatch.jpg'), genre: 'Криминал' },
    { id: 5, title: 'Перевозчик', imageUrl: require('../../assets/images/perevoz.jpg'), genre: 'Экшн' },
  ];

  useEffect(() => {
    setMovies(exampleMovies);
    setFilteredMovies(exampleMovies);
  }, []);

  const searchMovies = () => {
    const filtered = exampleMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const filterByGenre = (genre: string) => {
    const filtered = exampleMovies.filter(movie => movie.genre === genre);
    setFilteredMovies(filtered);
  };

  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const toggleFavorite = (movie: Movie) => {
    if (favorites.includes(movie)) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState); // Переключение темы

  const styles = isDarkMode ? darkStyles : lightStyles; // Выбор стилей в зависимости от темы

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Переключатель темы */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Подбор фильмов</Text>
            {Platform.OS === 'ios' ? (
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleSwitch}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                />
            ) : (
                <TouchableOpacity style={lightStyles.androidButton} onPress={toggleSwitch}>
                  <Text style={lightStyles.androidButtonText}>
                    {isDarkMode ? 'Включить светлую тему' : 'Включить тёмную тему'}
                  </Text>
                </TouchableOpacity>
            )}
          </View>

          <TextInput
              style={styles.input}
              placeholder="Введите название фильма"
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
          />

          <TouchableOpacity style={styles.searchButton} onPress={searchMovies}>
            <Text style={styles.searchButtonText}>Поиск</Text>
          </TouchableOpacity>

          <View style={styles.genreContainer}>
            <TouchableOpacity onPress={() => filterByGenre('Экшн')} style={styles.genreButton}>
              <Text style={styles.genreButtonText}>Экшн</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByGenre('Драма')} style={styles.genreButton}>
              <Text style={styles.genreButtonText}>Драма</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterByGenre('Комедия')} style={styles.genreButton}>
              <Text style={styles.genreButtonText}>Комедия</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilteredMovies(exampleMovies)} style={styles.genreButton}>
              <Text style={styles.genreButtonText}>Все</Text>
            </TouchableOpacity>
          </View>



          <FlatList
              data={filteredMovies}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.movieItem}>
                    <Image source={item.imageUrl} style={styles.thumbnail} />
                    <Text style={styles.movieTitle}>{item.title}</Text>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(item)}
                    >
                      <Text style={styles.favoriteButtonText}>
                        {favorites.includes(item) ? "Удалить из избранного" : "В избранное"}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
          />

          {selectedMovie && (
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={closeModal}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Image source={selectedMovie.imageUrl} style={styles.image} />
                    <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
          )}

          <Text style={styles.favoritesTitle}>Избранные фильмы</Text>
          <FlatList
              data={favorites}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.favoriteItem}>
                    <Text style={styles.favoriteItemText}>{item.title}</Text>
                  </TouchableOpacity>
              )}
          />
        </View>
      </KeyboardAvoidingView>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  genreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genreButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  genreButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  movieItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    height: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  favoriteButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  favoriteItem: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 10,
  },
  favoriteItemText: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 270,
    height: 360,
    resizeMode: 'contain',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  switchContainer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchText: {
    color: '#333',
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: "auto",
  },
  androidButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  androidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#444',
  },
  searchButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  genreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genreButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  genreButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  movieItem: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    height: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  favoriteButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#444',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  favoriteItem: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 8,
    marginBottom: 10,
  },
  favoriteItemText: {
    fontSize: 16,
    color: '#fff',
  },
  image: {
    width: 270,
    height: 360,
    resizeMode: 'contain',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  switchContainer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: "auto",
  },
});

export default App;
