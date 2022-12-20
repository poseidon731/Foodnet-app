import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { CartIndex, CartDetail, CartExtra, CartDeliveryAdd, Success, Errors } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackCart = createStackNavigator();
export default CartStack = () => {
  return (
    <StackCart.Navigator initialRouteName='CartIndex'
      screenOptions={{ gestureEnabled: false, ...TransitionPresets.SlideFromRightIOS }}>
      <StackCart.Screen name='CartIndex' component={CartIndex} options={navOptionHandler} />
      <StackCart.Screen name='CartDetail' component={CartDetail} options={navOptionHandler} />
      <StackCart.Screen name='CartExtra' component={CartExtra} options={navOptionHandler} />
      <StackCart.Screen name='CartDeliveryAdd' component={CartDeliveryAdd} options={navOptionHandler} />
      <StackCart.Screen name='Success' component={Success} options={navOptionHandler} />
      <StackCart.Screen name='Errors' component={Errors} options={navOptionHandler} />
    </StackCart.Navigator>
  )
}