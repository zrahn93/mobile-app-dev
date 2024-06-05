import React, {useState, useEffect} from 'react'
import { ScrollView, FlatList, SafeAreaView, View, ImageBackground } from 'react-native';
import { Text, TextInput, Button, PaperProvider } from 'react-native-paper';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';
import styles from '../styles/style';
import { geocodeKey } from '../../auth';
import Attraction from '../components/attraction'

const Attractions = ( props => {
  const [attractions, setAttractions] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const isFocused = useIsFocused();

  _retrieveLocation = async () => {
    try {
      const loc = await AsyncStorage.getItem('userLocation');
      if (loc !== null) {
          console.log("Received location: " + loc);
          setSearchLocation(loc)
      }
    } catch (error) {
      console.log("Did not retrieve data for Location")
      console.log(error)
    }
  }

  const getAttractions = () => {
    if (searchLocation === "") {
      console.log('Enter a location for searching')
    }
    else {
      var url = `https://geocode.maps.co/search?q=${searchLocation}&api_key=${geocodeKey}`;
      fetch(url)
      .then(response => response.json())
      .then(data => {
          console.log('successful geocode response', data)

          const lat = data[0].lat
          const lon = data[0].lon
          url = `http://node.cci.drexel.edu:9331/attractions?lat=${lat}&lon=${lon}&radius=10`
          fetch(url)
          .then(response => response.json())
          .then(data => {
              console.log('successful attractions response', data)
              setAttractions(data.attractions)
              })
          .catch(error => {
              console.log(error);
          });
      })
      .catch(error => {
          console.log(error);
      });
    }
    getAttractions();
  };

  useEffect(() => {
    _retrieveLocation();
  }, []);

  return (
    <View style={[styles.container]}>
        <View style={[{margin: 10, flexDirection: 'row'}]}>
            <TextInput
                value={searchLocation}
                label="Location"
                mode="outlined"
                onChangeText={inputLocation => setSearchLocation(inputLocation)}
            />
          <Button
            style={[{alignSelf: 'center', width: '40%', marginHorizontal: 15}]}
            icon="home-search-outline"
            mode="contained-tonal"
            onPress={getAttractions}
          >Search</Button>
        </View>
        {attractions.map( (attractionData, index)=> { return (
          <Attraction key={index} name={attractionData.name} description={attractionData.description} price={attractionData.price} pictures={attractionData.pictures}/>
        )})}
    </View>
  );
});

const AttractionsScreen = ( ({navigation}) => {

    return (
      <ScrollView>
      <PaperProvider theme={theme}>
        <View style={{backgroundColor: theme.backgroundColor}}>
          <SafeAreaView contentContainerStyle={styles.container}>
            <Attractions /> 
          </SafeAreaView>
        </View>
      </PaperProvider>
    </ScrollView>
  );
})

export default AttractionsScreen;