import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { Home, Detail, Extra, DailyMenuExtra } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackHome = createStackNavigator();
export default HomeStack = () => {
  return (
    <StackHome.Navigator initialRouteName='Home'
      screenOptions={{...TransitionPresets.ModalSlideFromBottomIOS}}>
      <StackHome.Screen name='Home' component={Home} options={navOptionHandler} />
      <StackHome.Screen name='Detail' component={Detail} options={navOptionHandler} />
      <StackHome.Screen name='Extra' component={Extra} options={navOptionHandler} />
      <StackHome.Screen name='DailyMenuExtra' component={DailyMenuExtra} options={navOptionHandler} />
    </StackHome.Navigator>
  )
}