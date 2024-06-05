import React, {useState, useEffect} from 'react'
import { View, FlatList, Alert } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';

const Story = ( props => {
    const [comments, setComments] = useState(props.data.comments)
    const [userComment, setUserComment] = useState('');
    this.inputText = React.createRef();

    useEffect(() => {
        setComments(props.data.comments)
    }, [props.commentKey]);

    const postComment = () => {
        if (userComment === "") {
            console.error("No comment found")
            Alert.alert("Please add a comment")
            return
        }
        // Add comment to list
        const commentData = {
            "username": props.user,
            "displayName": props.displayName,
            "comment": userComment
        }
        console.log(commentData)
        let updatedStoryData = {...props.data}
        updatedStoryData.comments = [...updatedStoryData.comments, commentData]

        // Update database
        console.log("Posting comment")
        const url = 'http://node.cci.drexel.edu:9331/updatePost';
        const postOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStoryData)
        }
        fetch(url, postOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                console.log("Posted message")
                setComments(updatedStoryData.comments)
                this.inputText.current.clear();
                setUserComment('')
            } else {
                Alert.alert("Error: Failed to send post")
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <View>
            <Card style={{marginVertical: 5, marginHorizontal: 5}}>
                <Card.Content>
                    <Text variant="bodyMedium">{props.data.pubDate}</Text>
                    <Text variant="bodyLarge" style={{padding: 5}}>{props.data.title}</Text>
                    <Text variant="bodyMedium">{props.data.story}</Text>
                    <Text variant="labelMedium">{props.data.source}</Text>
                    {comments.map( (comment, index)=> { return (
                        <Card key={index} style={{marginVertical: 2, marginHorizontal: 5}}>
                            <Card.Content>
                                <Text variant="labelMedium">{comment.displayName}</Text>
                                <Text variant="bodyMedium">{comment.comment}</Text>
                            </Card.Content>
                        </Card>
                    )})}
                </Card.Content>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        ref={this.inputText}
                        style={{width: '85%'}}
                        multiline
                        numLines={1}
                        label='Comment'
                        mode="outlined"
                        onChangeText={updatedComment => setUserComment(updatedComment)}
                        value={userComment}
                    />
                    <Button
                        style={[{alignSelf: 'center', height: 40, width: 40, borderRadius: 20, justifyContent: 'center'}]}
                        icon="send"
                        mode="contained-tonal"
                        onPress={postComment}
                    />
                </View>
            </Card>
        </View>
    );
});

export default Story;
