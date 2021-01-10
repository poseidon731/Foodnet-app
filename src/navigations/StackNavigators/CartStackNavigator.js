import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { Cart, CartDetail } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackCart = createStackNavigator();
export default CartStack = () => {
  return (
    <StackCart.Navigator initialRouteName='Cart'
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackCart.Screen name='Cart' component={Cart} options={navOptionHandler} />
      <StackCart.Screen name='CartDetail' component={CartDetail} options={navOptionHandler} />
    </StackCart.Navigator>
  )
}