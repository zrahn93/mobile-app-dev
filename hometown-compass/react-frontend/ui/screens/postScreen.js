import React, {useState, useEffect} from 'react'
import { SafeAreaView, ScrollView, Alert, View, ImageBackground } from 'react-native';
import { Text, TextInput, Button, PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import theme from '../styles/theme';
import styles from '../styles/style';
import uuid from 'react-native-uuid';

const PostScreen = ( () => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [postContent, setPostContent] = useState('');
    const isFocused = useIsFocused();
    this.inputText = React.createRef();

    _retrieveLocation = async () => {
        try {
          const loc = await AsyncStorage.getItem('userLocation');
          if (loc !== null) {
            console.log("Received location: " + loc);
            setLocation(loc)
          }
        } catch (error) {
            console.log("Did not retrieve data for Location")
            console.log(error)
        }
    }

    useEffect(() => {
        _retrieveLocation();
    }, [isFocused]);

    const sendPost = () => {
        console.log("Posting: ", title)
        const url = 'http://node.cci.drexel.edu:9331/updatePost';
        const postOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "id": uuid.v4(),
                "title": title,
                "story": postContent,
                "date": new Date().toLocaleString(),
                "location": location,
                'source': 'Hometown Compass'
            })
        }
        fetch(url, postOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                console.log("Posted message")
                this.inputText.current.clear();
                setTitle('')
                setPostContent('')
                Alert.alert("Post sent!")
            } else {
                Alert.alert("Error: Failed to send post")
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <ScrollView>
            <PaperProvider theme={theme}>
                <View style={{backgroundColor: theme.backgroundColor}}>
                    <SafeAreaView contentContainerStyle={[styles.container]}>
                        <View style={{margin:'50px'}}>
                            <TextInput
                                value={location}
                                label='Location'
                                onChangeText={newLocation => { setTitle(newLocation) }}
                            />
                            <TextInput
                                ref={this.inputText}
                                value={title}
                                label='Headline'
                                onChangeText={newTitle => { setTitle(newTitle) }}
                            />
                            <TextInput
                                ref={this.inputText}
                                multiline
                                numberOfLines={15}
                                label='Story'
                                onChangeText={text => setPostContent(text)}
                                value={postContent}
                            />
                            <Button
                                style={[{alignSelf: 'center', width: '30%', marginTop: 50}]}
                                icon="account-check"
                                mode="contained-tonal"
                                onPress={sendPost}
                            >Post</Button>
                        </View>
                    </SafeAreaView>
                </View>
            </PaperProvider>
        </ScrollView>
    );
})

export default PostScreen;
