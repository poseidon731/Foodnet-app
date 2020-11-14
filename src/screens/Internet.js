import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useNetInfo } from "@react-native-community/netinfo";
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Content } from 'native-base';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setInternet } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { InternetIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Internet = (props) => {
    // const dispatch = useDispatch();
    // const netInfo = useNetInfo();

    // const onConnect = () => {
    //     if (netInfo.isConnected) {
    //         global.internet = true;
    //         console.log('Connected Status: ', netInfo.isConnected, ' - ', global.internet);
    //         props.navigation.pop();
    //     }
    // }
    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft} />
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('No internet')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <View style={styles.content}>
                <InternetIcon />
                <Text style={styles.mainText}>{i18n.translate('No internet connection')}</Text>
                <Text style={styles.subText}>{i18n.translate('Please connect to the internet and refresh')}</Text>

                {/* <TouchableOpacity style={styles.button} onPress={() => onConnect()}>
                    <Text style={[common.buttonText, common.fontColorYellow]}>{i18n.translate('Refresh')}</Text>
                </TouchableOpacity> */}
                <View style={common.height50} />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainText: {
        marginTop: 30,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111'
    },
    subText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666'
    },
    button: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 6,
        backgroundColor: '#FEEBD6'
    },

});