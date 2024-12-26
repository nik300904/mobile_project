import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    Button,
} from 'react-native';
import { Video } from 'expo-av';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';

interface Movie {
    id: string;
    title: string;
    imageUrl: any; // Image source type
    audioUrl: any;
    videoUrl: any;
}

const MediaScreen = () => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const exampleMovies: Movie[] = [
        {
            id: '1',
            title: 'Пчеловод',
            imageUrl: require('../../assets/images/bee.jpg'),
            videoUrl: Asset.fromModule(require('../../assets/videos/beekeeper.mp4')).uri,
            audioUrl: Asset.fromModule(require('../../assets/audio/beekeeper.mp3')).uri,
        },
        {
            id: '2',
            title: 'Револьвер',
            imageUrl: require('../../assets/images/revol.jpg'),
            videoUrl: Asset.fromModule(require('../../assets/videos/revolver.mp4')).uri,
            audioUrl: Asset.fromModule(require('../../assets/audio/revolver.mp3')).uri,
        },
    ];

    const handleMoviePress = (movie: Movie) => {
        setSelectedMovie(movie);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedMovie(null);
        if (sound) {
            sound.stopAsync();
            setSound(null);
        }
    };

    const playAudio = async (url: string) => {
        if (sound) {
            sound.stopAsync();
            setSound(null);
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
        setSound(newSound);
        await newSound.playAsync();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>🎥 Подбор фильмов</Text>
            <FlatList
                data={exampleMovies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.movieItem}>
                        <Image source={item.imageUrl} style={styles.thumbnail} />
                        <Text style={styles.movieTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {selectedMovie && (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                        <Image source={selectedMovie.imageUrl} style={styles.image} />
                        <Text style={styles.sectionTitle}>🎬 Трейлер:</Text>
                        <Video
                            source={{ uri: selectedMovie.videoUrl }}
                            style={styles.video}
                            useNativeControls
                            resizeMode="contain"
                        />
                        <Text style={styles.sectionTitle}>🎵 Аудиофрагмент:</Text>
                        {/*<Audio  source={{ uri: selectedMovie.audioUrl }}></Audio>*/}
                        <Button
                            title="Воспроизвести аудио"
                            onPress={() => playAudio(selectedMovie.audioUrl)}
                        />
                        <Button title="Закрыть" onPress={closeModal} />
                    </SafeAreaView>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#1c1c1e', // Темный фон
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    movieItem: {
        maxHeight: 200,
        backgroundColor: '#2c2c2e',
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    thumbnail: {
        width: 120,
        height: 180,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    movieTitle: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#1c1c1e',
        padding: 20,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: 270,
        height: 360,
        resizeMode: 'contain',
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
    },
    video: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#000',
    },
});

export default MediaScreen;
