import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux';
import { Splash } from '@screens';
import DrawerNavigator from '@navigations/DrawerNavigator';
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
                {/* <StackApp.Navigator initialRouteName={'App'}> */}
                    <StackApp.Navigator initialRouteName={this.props.logged ? 'App' : 'Splash'}>
                    <StackApp.Screen name='Splash' component={Splash} options={navOptionHandler} />
                    <StackApp.Screen name='Auth' component={AuthStack} options={navOptionHandler} />
                    <StackApp.Screen name='App' component={DrawerNavigator} options={navOptionHandler} />
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