import React, {useState} from 'react'
import { SafeAreaView, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, PaperProvider } from 'react-native-paper';
import theme from '../styles/theme';
import styles from '../styles/style';

const PostScreen = ( () => {
  const [journalContent, setJournalContent] = useState('');
  const [tags, setTags] = useState([]);
  this.inputText = React.createRef();

  // Removing empty strings
  const formatTags = ( (index, newTag) => {
    tags[index] = newTag
    var newTags = []
    addNewTagField = true;
    tags.forEach(tag => {
      if (tag != '')
        newTags = [...newTags, tag]
    })
    setTags(newTags)
  })

  const postJournalEntry = () => {
    console.log("Posting: ", journalContent)
    const url = 'http://node.cci.drexel.edu:9331/newMessage';
    const postOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"message": journalContent, "tags": tags})
    }
    fetch(url, postOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status == 200) {
          console.log("Posted message")
          this.inputText.current.clear();
          setJournalContent('')
          setTags([])
          Alert.alert("Journal entry posted!")
        } else {
          Alert.alert("Error: Failed to posted journal entry")
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <ScrollView>
      <PaperProvider theme={theme}>
        <SafeAreaView contentContainerStyle={[styles.container]}>
            <TextInput
                ref={this.inputText}
                style={{margin:'50px'}}
                multiline
                numberOfLines={15}
                label='Journal Entry'
                onChangeText={text => setJournalContent(text)}
                value={journalContent}
            />
            { [...tags, ''].map( (tagStr, index) => { return(
                <TextInput
                key={index}
                value={tagStr}
                placeholder='Add a tag to the post'
                onChangeText={newTag => {
                  formatTags(index, newTag)
                }}
              />            )})}
            <Button
              style={[{alignSelf: 'center', width: '30%', marginTop: 50}]}
              icon="account-check"
              mode="contained-tonal"
              onPress={postJournalEntry}
            >Post</Button>
        </SafeAreaView>
      </PaperProvider>
    </ScrollView>
  );
})

export default PostScreen;
