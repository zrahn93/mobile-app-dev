import React from 'react'
import { Pressable } from 'react-native';
import { Text, Card } from 'react-native-paper';
import styles from '../components/styles';

const Photo = ( props => {
  return (
    <Pressable
      onPress={ () => 
        props.navigation.navigate("Image", {image: {"img": props.img, "caption": props.caption}}) }
      style={styles.galleryImageContainer}
    >
      <Card style={styles.card} >
        <Card.Cover
          source={ props.img }
          resizeMode={'cover'}
        />
        <Card.Content>
          <Text variant="bodyMedium">{props.caption}</Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
});

export default Photo;