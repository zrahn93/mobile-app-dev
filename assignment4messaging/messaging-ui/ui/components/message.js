import React from 'react'
import { View, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';

const Message = ( props => {
    return (
        <View>
            <Card style={{marginVertical: 2, marginHorizontal: 5}}>
                <Card.Content>
                    <Text variant="bodyLarge">{props.message}</Text>
                    <Text variant="bodyMedium" style={{paddingTop: 10}}>Tags:</Text>
                    <FlatList
                        style={{flexDirection: 'row'}}
                        data={props.tags}
                        keyExtractor={(item, index) => index}
                        renderItem={({item: messageText}) => (
                            <Text variant="labelSmall" style={{paddingLeft: 10}}>{messageText}</Text>
                        )}
                    />
                </Card.Content>
            </Card>
        </View>
    );
});

export default Message;