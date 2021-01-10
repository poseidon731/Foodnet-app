import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { Order, OrderDetail } from '@screens';
import { navOptionHandler } from '@utils/functions';

const StackOrder = createStackNavigator();
export default OrderStack = () => {
  return (
    <StackOrder.Navigator initialRouteName='Order'
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
      <StackOrder.Screen name='Order' component={Order} options={navOptionHandler} />
      <StackOrder.Screen name='OrderDetail' component={OrderDetail} options={navOptionHandler} />
    </StackOrder.Navigator>
  )
}