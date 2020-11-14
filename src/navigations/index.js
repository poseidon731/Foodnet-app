import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import NetInfo from '@react-native-community/netinfo';
import i18n from '@utils/i18n';

import { Internet, Splash } from '@screens';
import DrawerNavigator from '@navigations/DrawerNavigator';
import AuthStack from '@navigations/StackNavigators/AuthStackNavigator';
import { navOptionHandler } from '@utils/functions';

const StackApp = createStackNavigator();
export default AppContainer = () => {
    const { logged, country } = useSelector(state => state.auth);
    i18n.setLocale(country);

    const unsubscribe = NetInfo.addEventListener(state => {
        if (!state.isConnected && navigator && global.internet) {
            global.internet = false;
            navigator.dispatch(StackActions.push('Internet'));
        }
        if (state.isConnected && navigator && !global.internet) {
            global.internet = true;
            navigator.dispatch(StackActions.pop());
        }
    });

    // unsubscribe();

    return (
        <NavigationContainer ref={nav => navigator = nav}>
            <StackApp.Navigator initialRouteName={logged ? 'App' : 'Splash'} screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
                <StackApp.Screen name='Internet' component={Internet} options={{ headerShown: false, animationEnabled: false }} />
                <StackApp.Screen name='Splash' component={Splash} options={navOptionHandler} />
                <StackApp.Screen name='Auth' component={AuthStack} options={navOptionHandler} />
                <StackApp.Screen name='App' component={DrawerNavigator} options={navOptionHandler} />
            </StackApp.Navigator>
        </NavigationContainer>
    );
}