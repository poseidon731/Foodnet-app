import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { Home } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackHome = createStackNavigator();
export default HomeStack = () => {
  return (
    <StackHome.Navigator initialRouteName='Home'
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS
      }}>
      <StackHome.Screen name='Home' component={Home} options={navOptionHandler} />
    </StackHome.Navigator>
  )
}