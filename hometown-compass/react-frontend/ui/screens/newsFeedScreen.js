import React, {useState, useEffect} from 'react'
import { ScrollView, FlatList, SafeAreaView, View, ImageBackground } from 'react-native';
import { Text, TextInput, Button, PaperProvider } from 'react-native-paper';
import { useIsFocused } from "@react-navigation/native";
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Story from '../components/story'
import theme from '../styles/theme';
import styles from '../styles/style';

const Feed = ( props => {
  const [user, setUser] = useState(props.user)
  const [userDisplayName, setUserDisplayName] = useState(props.displayName)
  const [stories, setStories] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [commentKeys, setCommentKeys] = useState([]);
  const isFocused = useIsFocused();

  _retrieveData = async () => {
    try {
      const loc = await AsyncStorage.getItem('userLocation');
      if (loc !== null) {
          setSearchLocation(loc)
      }
    } catch (error) {
      console.log("Did not retrieve data for Location")
      console.log(error)
    }
    try {
      const username = await AsyncStorage.getItem('username');
      if (username !== null) {
        console.log("Received username: " + username);
        setUser(username)
      }
    } catch (error) {
        console.log("Did not retrieve data for username")
        console.log(error)
    }
    try {
        const displayName = await AsyncStorage.getItem('displayName');
        if (displayName !== null) {
          console.log("Received display name: " + displayName);
          setUserDisplayName(displayName)
        }
      } catch (error) {
          console.log("Did not retrieve data for display name")
          console.log(error)
      }
      getFeed();
  }

  useEffect(() => {
    _retrieveData()
  }, []);

  const getFeed = () => {
    if (searchLocation === "") {
      console.log('Enter a location for searching')
    }
    else {
      const url = `http://node.cci.drexel.edu:9331/feed?location=${searchLocation}`;
      fetch(url)
      .then(response => response.json())
      .then(data => {
          console.log('successful news feed response', data)
          updatedCommentKeys = []
          data.stories.forEach(story => {
            if (!story.id) {
              story.id = uuid.v4();
            }
            if (!story.comments) {
              story.comments = []
            }
            updatedCommentKeys.push(uuid.v4())
          })
          setStories(data.stories)
          setCommentKeys(updatedCommentKeys)
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <View style={[styles.container, {margin: 10}]}>
      <View style={{flexDirection:'row'}}>
        <TextInput
          value={searchLocation}
          placeholder='Hometown, State'
          mode="outlined"
          onChangeText={location => setSearchLocation(location)}
        />
        <Button
          style={[{alignSelf: 'center', width: '40%', marginHorizontal: 15}]}
          icon="home-search-outline"
          mode="contained-tonal"
          onPress={getFeed}
        >Search</Button>
      </View>
      <View>
      {stories.map( (storyData, index)=> { return (
        <Story key={index} data={storyData} showComments={false} user={user} displayName={userDisplayName} commentKey={commentKeys[index]} />
      )})}
      </View>
    </View>
  );
});

const NewsFeedScreen = ( ({navigation}) => {

    return (
      <ScrollView>
      <PaperProvider theme={theme}>
        <View style={{backgroundColor: theme.backgroundColor}}>
          <SafeAreaView contentContainerStyle={styles.container}>
            <Feed /> 
          </SafeAreaView>
        </View>
      </PaperProvider>
    </ScrollView>
  );
})

export default NewsFeedScreen;