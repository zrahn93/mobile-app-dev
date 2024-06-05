import React, {useState, useEffect} from 'react'
import { ScrollView, SafeAreaView, View } from 'react-native';
import { Text, TextInput, PaperProvider } from 'react-native-paper';
import { useIsFocused } from "@react-navigation/native";
import Message from '../components/message'
import theme from '../styles/theme';
import styles from '../styles/style';

const Posts = ( props => {
  const [messages, setMessages] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);
  const isFocused = useIsFocused();

  const getJournalEntries = () => {
    const url = `http://node.cci.drexel.edu:9331/messages?tags=${tagFilters.join(',')}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('successful messages response', data)
        setMessages(data.messages)
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getJournalEntries();
  }, [isFocused, tagFilters]);

  // Removing empty strings
  const filterByTags = ( (index, newTag) => {
    tagFilters[index] = newTag
    var newTags = []
    addNewTagField = true;
    tagFilters.forEach(tag => {
      if (tag != '')
        newTags = [...newTags, tag]
    })
    setTagFilters(newTags)
    getJournalEntries();
  })

  return (
    <View style={[{margin: 10}]}>
      <Text variant="titleSmall">Tag Filter</Text>
      { [...tagFilters, ''].map( (tagStr, index) => { return(
          <TextInput
          key={index}
          value={tagStr}
          placeholder='Filter by tags'
          onChangeText={newTag => {
            filterByTags(index, newTag)
          }}
        />
      )})}
      <Text variant="titleLarge" style={{marginTop: 35}}>Posts</Text>
      <View>
        { [...messages, ''].map( (messageData, index) => { return(
          <Message key={index} message={messageData.message} tags={messageData.tags} />
        )})}
      </View>
      <Text variant="labelMedium">{messages.length} total post{messages.length != 1 ? 's' : ''}</Text>
    </View>
  );
});

const ReadScreen = ( () => {
    return (
    <ScrollView>
      <PaperProvider theme={theme}>
        <SafeAreaView contentContainerStyle={styles.container}>
          <Posts /> 
        </SafeAreaView>
      </PaperProvider>
    </ScrollView>
  );
})

export default ReadScreen;
