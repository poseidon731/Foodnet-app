import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackHome = createStackNavigator();
export default function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName='Home'>
      <StackHome.Screen name='Home' component={Home} options={navOptionHandler} />
    </StackHome.Navigator>
  )
}