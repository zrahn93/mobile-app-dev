
import React from 'react'
import { View } from 'react-native';
import { PaperProvider, Button, Card} from 'react-native-paper';
import { useRoute } from "@react-navigation/native"
import theme from '../components/theme';
import styles from '../components/styles';

const ImageScreen = ( ({navigation}) => {
    const route = useRoute()
    const image = route.params?.image
    return (
      <PaperProvider theme={theme}>
        <Button
          icon="chevron-left"
          mode="text"
          onPress={() => navigation.navigate("Gallery")}
          style={styles.backButton}
        >
          Gallery
        </Button>
        <View style={[styles.container]}>
          <Card style={styles.largeCard} >
            <Card.Cover source={image.img} resizeMode={'cover'} style={[styles.largeImage]}/>
            <Card.Title subtitle={image.caption} style={{flex: 0.2}}/>
          </Card>
        </View>
      </PaperProvider>
    );
  })

export default ImageScreen;