import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right, Footer } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeStack from '@navigations/StackNavigators/HomeStackNavigator';
import { navOptionHandler } from '@utils/functions';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { deleteToken } from '@modules/reducers/auth/actions';
import { common, colors } from '@constants/themes';
import { InboxIcon, OrderIcon, ProfileIcon, CouponIcon, LocationIcon, LanguageIcon, ServiceIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

const Drawer = createDrawerNavigator();
export default function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />} drawerStyle={{ width: wp('100%') }}>
            <Drawer.Screen name="Home" component={HomeStack} options={navOptionHandler} />
            {/* <Drawer.Screen name="Logout" component={Logout} /> */}
        </Drawer.Navigator>
    )
}

const DrawerContent = (props) => {
    const logged = useSelector(state => state.auth.logged);
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
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                        <Icon type='ionicon' name='ios-close' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Home')}</Text>
                </View>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => alert('Inbox')}>
                        <InboxIcon />
                    </TouchableOpacity>
                </View>
            </Header>
            <Content style={styles.content}>
                <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Home')}>
                    <OrderIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('My orders')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <ProfileIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('Profile')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <CouponIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('Coupon codes')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <LocationIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('My addresses')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <LanguageIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('Language selector')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <ServiceIcon />
                    <Text style={styles.menuTitle}>{i18n.translate('Customer service')}</Text>
                </TouchableOpacity>
            </Content>
            {logged && (
                <Footer style={styles.header}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => onLogout()}>
                        <Icon type='material-community' name='logout-variant' size={25} color={colors.YELLOW.PRIMARY} />
                        <Text style={styles.menuTitle}>{i18n.translate('Log out')}</Text>
                    </TouchableOpacity>
                </Footer>
            )}
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%')
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
        paddingTop: 20
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    menuTitle: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '400',
        color: '#111'
    }
});