import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import Toast from 'react-native-simple-toast';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { deleteToken } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { isEmpty } from '@utils/functions';
import { themes, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { BackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Home = (props) => {
    const [loading, setLoading] = useState(false);

    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(deleteToken());
        props.navigation.reset({
            index: 1,
            routes: [
                { name: 'Splash' }
            ]
        })
    }

    return (
        <Container style={styles.container}>
            <StatusBar />
            <Header style={styles.header}>
                <Left style={{ paddingLeft: 10 }}>
                    <TouchableOpacity onPress={() => onLogout()}>
                        <BackIcon style={styles.backIcon} />
                    </TouchableOpacity>
                </Left>
                <Title>
                    <Text style={styles.titleText}>{i18n.translate('Home')}</Text>
                </Title>
                <Right style={{ paddingRight: 10 }} />
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
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    backIcon: {
        width: 25,
        height: 25
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    content: {
        padding: 20
    },
    inputView: {
        marginTop: 20,
        width: '100%'
    },
});