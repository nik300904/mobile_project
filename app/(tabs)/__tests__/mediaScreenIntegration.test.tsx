import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MediaScreen from '../lab4';


jest.mock('expo-av', () => ({
    Audio: {
      Sound: {
        createAsync: jest.fn(() => ({
          sound: {
            playAsync: jest.fn(),
            stopAsync: jest.fn(),
          },
        })),
      },
    },
  }));
  

describe('MediaScreen Media Interaction', () => {
    it('plays audio when the button is pressed', async () => {
      const { getByText } = render(<MediaScreen />);
  
      // Нажимаем на фильм
      fireEvent.press(getByText('Пчеловод'));
  
      // Нажимаем кнопку воспроизведения аудио
      fireEvent.press(getByText('Воспроизвести аудио'));
  
      // Проверяем, что аудио было воспроизведено
      const mockPlayAsync = jest.fn();
      jest.spyOn(require('expo-av').Audio.Sound.prototype, 'playAsync').mockImplementation(mockPlayAsync);
  
      await waitFor(() => expect(mockPlayAsync).toHaveBeenCalled());
    });
  });