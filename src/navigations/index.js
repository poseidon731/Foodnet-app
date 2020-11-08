import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Splash } from '@screens';
// import BottomTabNavigator from '@navigations/BottomTabNavigator';
import AuthStack from '@navigations/StackNavigators/AuthStackNavigator';
import HomeStack from '@navigations/StackNavigators/HomeStackNavigator';
import { navOptionHandler } from '@utils/functions';
import { connect } from 'react-redux';

const StackApp = createStackNavigator();
class AppContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <NavigationContainer>
                <StackApp.Navigator initialRouteName={this.props.logged ? 'Home' : 'Splash'}>
                    <StackApp.Screen name='Splash' component={Splash} options={navOptionHandler} />
                    <StackApp.Screen name='Auth' component={AuthStack} options={navOptionHandler} />
                    <StackApp.Screen name='Home' component={HomeStack} options={navOptionHandler} />
                </StackApp.Navigator>
            </NavigationContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        logged: state.auth.logged,
        token: state.auth.token
    }
}

export default connect(mapStateToProps, undefined)(AppContainer);