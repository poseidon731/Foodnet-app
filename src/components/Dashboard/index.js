import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Content, Body } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import Featured from './Featured';
import Trendy from './Trendy';
import Result from './Result';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { SearchIcon, FilterIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';

export default Dashboard = (props) => {
    const [search, setSearch] = useState('');

    return (
        <Body style={common.container}>
            <View style={styles.topView}>
                <Image source={images.pizzaImage} />
                <View style={styles.topRight}>
                    <Text style={styles.topTitle}>{i18n.translate('Extra discounts')}</Text>
                    <View style={styles.topSpace} />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.topButton}>
                            <Text style={styles.topText}>{i18n.translate('Know more')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Content style={styles.content}>
                <View key='search' style={styles.inputView}>
                    <TextField
                        placeholder={i18n.translate('What do you eat')}
                        placeholderTextColor='#666'
                        autoCapitalize='none'
                        returnKeyType='done'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={search}
                        containerStyle={styles.textContainer}
                        inputContainerStyle={styles.inputContainer}
                        renderLeftAccessory={() => {
                            return (
                                <SearchIcon style={{ marginRight: 10 }} />
                            )
                        }}
                        renderRightAccessory={() => {
                            return (
                                <TouchableOpacity onPress={() => props.onFilter()} >
                                    <FilterIcon style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            )
                        }}
                        onChangeText={(value) => {
                            console.log('ese')
                        }}
                    />
                </View>
                {!isEmpty(props.featured) && (<Featured key='featured' data={props.featured} />)}
                {!isEmpty(props.trendy) && (<Trendy key='trendy' data={props.trendy} />)}
                {!isEmpty(props.result) && (<Result key='result' data={props.result} />)}
                <View style={common.height50} />
            </Content>
        </Body>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    topView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: wp('100%'),
        paddingVertical: 10,
        backgroundColor: '#FEEBD6'
    },
    topRight: {
        marginLeft: 22,
        justifyContent: 'center',
    },
    topTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 30,
        color: colors.YELLOW.PRIMARY
    },
    topSpace: {
        height: 16
    },
    topButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.YELLOW.PRIMARY,
        borderRadius: 6
    },
    topText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    inputView: {
        width: '100%'
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: colors.GREY.PRIMARY
    },
    inputContainer: {
        width: '100%',
        marginTop: -20,
        borderWidth: 0
    },
});