import React, {useState} from 'react'
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import styles from '../components/styles';
import Photo from '../components/galleryphoto'
import imageData from '../../data/images'

const Gallery = ( props => {    
  const [photos, setPhotos] = useState(imageData); 

  _keyExtractor = (item, index) => index;

  _renderItem = ({item: photoData}) => (
    <Photo
      navigation={props.navigation}
      img={photoData.img}
      caption={photoData.caption}
    />
  );

  return (
    <View style={[styles.gallery]}>
      <Text variant="bodyLarge" style={styles.galleryHeader}>Select an image from the Gallery to view</Text>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
      />
    </View>
  );
});

export default Gallery;