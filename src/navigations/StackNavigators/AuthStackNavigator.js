import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { SignIn, SignUp, Forgot, Reset, Cities } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackAuth = createStackNavigator();
export default AuthStack = () => {
  return (
    <StackAuth.Navigator initialRouteName='Cities'
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS, gestureEnabled: false 
      }}>
      <StackAuth.Screen name='SignIn' component={SignIn} options={navOptionHandler} />
      <StackAuth.Screen name='SignUp' component={SignUp} options={navOptionHandler} />
      <StackAuth.Screen name='Forgot' component={Forgot} options={navOptionHandler} />
      <StackAuth.Screen name='Reset' component={Reset} options={navOptionHandler} />
      <StackAuth.Screen name='Cities' component={Cities} options={navOptionHandler} />
    </StackAuth.Navigator>
  )
}
