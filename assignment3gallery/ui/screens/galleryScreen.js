import React from 'react'
import { SafeAreaView } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import theme from '../components/theme';
import styles from '../components/styles';
import Gallery from '../components/gallery'
import imageData from '../../data/images'

const GalleryScreen = ( ({navigation}) => {
  return (
    <PaperProvider theme={theme} style={styles.gallery}>
      <SafeAreaView contentContainerStyle={styles.container}>
        <Gallery navigation={navigation}/> 
      </SafeAreaView>
    </PaperProvider>
  );
})

export default GalleryScreen;