import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Splash } from '@screens';
// import BottomTabNavigator from '@navigations/BottomTabNavigator';
import AuthStack from '@navigations/StackNavigators/AuthStackNavigator';
import { navOptionHandler } from '@utils/functions';

const StackApp = createStackNavigator();
class AppContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <NavigationContainer>
                <StackApp.Navigator initialRouteName={'Splash'}>
                    <StackApp.Screen name='Splash' component={Splash} options={navOptionHandler} />
                    <StackApp.Screen name='Auth' component={AuthStack} options={navOptionHandler} />
                </StackApp.Navigator>
            </NavigationContainer>
        );
    }
}
export default AppContainer;