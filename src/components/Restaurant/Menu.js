import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default Menu = (props) => {
    useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

    const [category, setCategory] = useState(0);
    const [restaurantName, setRestaurantName] = useState('');

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity key={index} style={[styles.category, category == item.item.category_id ? common.borderColorYellow : common.borderColorGrey]}
                onPress={() => setCategory(item.item.category_id)}>
                <Text style={styles.name}>{item.item.category_name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Card key='menu' style={styles.card}>
                <Text style={styles.cardTitle}>{i18n.translate('Menu')}</Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={[{ category_id: 0, category_name: i18n.translate('All') }, ...props.categories]}
                    keyExtractor={(category, index) => index.toString()}
                    renderItem={renderItem}
                />
            </Card>
            <View style={{ height: 10 }} />
            <Card key='food' style={styles.card}>
                <Text style={[styles.cardTitle, { fontSize: 14 }]}>{i18n.translate('Find food')}</Text>
                <TextField
                    placeholder={i18n.translate('Name of food')}
                    placeholderTextColor='#666'
                    fontSize={16}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    value={restaurantName}
                    containerStyle={styles.textContainer}
                    inputContainerStyle={styles.inputContainer}
                    onChangeText={(value) => setRestaurantName(value)}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        width: '100%'
    },
    cardTitle: {
        marginVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        width: '60%'
    },
    category: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 2,
        borderColor: colors.YELLOW.PRIMARY,
        borderRadius: 6,
        marginRight: 10
    },
    name: {
        fontWeight: 'bold',
        color: '#333'
    },
    textContainer: {
        width: '100%',
        // marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
        borderColor: colors.GREY.PRIMARY
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0
    },
});