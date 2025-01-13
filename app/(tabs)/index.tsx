import React, {useState, useEffect, useMemo} from 'react';
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

export const exampleMovies: Movie[] = [
  { id: 1, title: 'Пчеловод', imageUrl: require('../../assets/images/bee.jpg'), genre: 'Драма' },
  { id: 2, title: 'Револьвер', imageUrl: require('../../assets/images/revol.jpg'), genre: 'Экшн' },
  { id: 3, title: 'Шальная карта', imageUrl: require('../../assets/images/card.jpg'), genre: 'Комедия' },
  { id: 4, title: 'Большой куш', imageUrl: require('../../assets/images/snatch.jpg'), genre: 'Комедия' },
  { id: 5, title: 'Перевозчик', imageUrl: require('../../assets/images/perevoz.jpg'), genre: 'Экшн' },
];

const App = () => {
  const [query, setQuery] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [genreFilter, setGenreFilter] = useState('');

  const filteredMovies = useMemo(() => {
    return exampleMovies.filter(movie => {
      const matchesQuery = movie.title.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = genreFilter ? movie.genre === genreFilter : true;
      return matchesQuery && matchesGenre;
    });
  }, [query, genreFilter]);

  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const toggleFavorite = (movie: Movie): void => {
    setFavorites(prevFavorites => {
      return prevFavorites.some(fav => fav.id === movie.id)
          ? prevFavorites.filter(fav => fav.id !== movie.id)
          : [...prevFavorites, movie];
    });
  };

  const toggleSwitch = () => setIsDarkMode(prevState => !prevState);

  const styles = isDarkMode ? darkStyles : lightStyles;

  const genres = ['Экшн', 'Драма', 'Комедия', 'Все'];

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Переключатель темы */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Подбор фильмов</Text>
            <Switch
                testID="theme-switch"
                value={isDarkMode}
                onValueChange={toggleSwitch}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <TextInput
              testID="search-input"
              style={styles.input}
              placeholder="Введите название фильма"
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
          />

          {/* Кнопки фильтров по жанру */}
          <View style={styles.genreContainer}>
            {genres.map(genre => (
                <TouchableOpacity
                    key={genre}
                    onPress={() => setGenreFilter(genre === 'Все' ? '' : genre)}
                    style={styles.genreButton}
                >
                  <Text style={styles.genreButtonText}>{genre}</Text>
                </TouchableOpacity>
            ))}
          </View>

          {/* Список фильмов */}
          <FlatList
              data={filteredMovies}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                  <TouchableOpacity
                      testID="movie-item"
                      onPress={() => handleMoviePress(item)}
                      style={styles.movieItem}
                  >
                    <Image source={item.imageUrl} style={styles.thumbnail} />
                    <Text style={styles.movieTitle}>{item.title}</Text>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(item)}
                    >
                      <Text
                      testID={`favorite-button-${item.id}`}
                      style={styles.favoriteButtonText}
                      >
                        {favorites.some(fav => fav.id === item.id)
                            ? 'Удалить из избранного'
                            : 'В избранное'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
          />

          {/* Модальное окно */}
          {selectedMovie && (
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Image source={selectedMovie.imageUrl} style={styles.image} />
                    <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
          )}

          {/* Список избранных фильмов */}
          <Text style={styles.favoritesTitle}>Избранные фильмы</Text>
          <FlatList
              data={favorites}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                  <TouchableOpacity
                      testID={`favorite-movie-${item.id}`}
                      onPress={() => handleMoviePress(item)}
                      style={styles.favoriteItem}
                  >
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
