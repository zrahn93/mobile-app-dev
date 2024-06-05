import React from 'react'
import { View, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';

const Message = ( props => {
    var tagList = []
    if (props.tags) {
        tagList = props.tags
    }

    return (
        <View>
            <Card style={{marginVertical: 2, marginHorizontal: 5}}>
                <Card.Content>
                    <Text variant="bodyLarge">{props.message}</Text>
                    <Text variant="bodyMedium" style={{paddingTop: 10}}>Tags:</Text>
                    { tagList.map( (messageText, index) => { return(
                        <Text key={index} variant="labelSmall" style={{paddingLeft: 10}}>{messageText}</Text>
                    )})}
                </Card.Content>
            </Card>
        </View>
    );
});

export default Message;