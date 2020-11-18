import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Content } from 'native-base';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { Cities } from '@components';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

export default Home = (props) => {
    const dispatch = useDispatch();
    const { logged, city, user } = useSelector(state => state.auth);

    const [citystatus, setCityStatus] = useState(false);

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => {
                        setCityStatus(false);
                        props.navigation.openDrawer();
                    }}>
                        <Icon type='ionicon' name='menu' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle} onPress={() => setCityStatus(!citystatus)}>
                    <Text style={common.headerTitleText}>{!logged ? city.name : user.city.name}</Text>
                    <Icon type='material' name={citystatus ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color={colors.BLACK} />
                </TouchableOpacity>
                <View style={common.headerRight} />
            </Header>
            {!citystatus ? (
                <Content style={styles.content}>
                    <Text style={styles.labelText}>{`Token:${user.token}`}</Text>
                </Content>
            ) : (
                    <View style={styles.cities}><Cities onSave={() => setCityStatus(false)} onLoading={(load) => dispatch(setLoading(load))} /></View>
                )}
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    cities: {
        flex: 1,
        padding: 20
    }
});