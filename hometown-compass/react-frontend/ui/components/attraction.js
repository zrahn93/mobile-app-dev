import React from 'react'
import { View, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';

const Attraction = ( props => {

    const AttractionImage = ( () => {
        var imageComponent = <View/>
        if (props.pictures.length > 0)
            imageComponent = <Card.Cover source={{ uri: props.pictures[0] }}/>
        return imageComponent;
    })
    
    const AttractionPrice = ( () => {
        var priceComponent = <View></View>
        if (props.price.amount > 0)
            priceComponent = <Text variant="labelSmall">${props.price.amount}</Text>
        return priceComponent;
    })

    return (
        <Card style={{marginVertical: 5, marginHorizontal: 5, width: '100%'}}>
            <AttractionImage />
            <Card.Title title={props.name} />
            <Card.Content>
                <Text variant="bodyMedium">{props.description}</Text>
                <AttractionPrice price={props.price}/>
            </Card.Content>
        </Card>
    );
});

export default Attraction;