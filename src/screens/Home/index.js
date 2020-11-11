import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { deleteToken } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

export default Home = (props) => {
    const [loading, setLoading] = useState(false);

    const token = useSelector(state => state.auth.token);
    // const dispatch = useDispatch();

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                        <Icon type='ionicon' name='menu' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Home')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                <View style={styles.inputView}>
                    <Text style={styles.labelText}>{`Token:${token}`}</Text>
                </View>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    inputView: {
        marginTop: 20,
        width: '100%'
    },
});