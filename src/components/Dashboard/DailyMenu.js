import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';

import moment from 'moment';
import FastImage from 'react-native-fast-image';
import ContentLoader from 'react-native-easy-content-loader';

const RenderItem = ({ cartRestaurant, cartProducts, dailyMenu, index, onDetail, onModal }) => {
  const [loader, setLoader] = useState(true);
  return (
    <Fragment>
      <ContentLoader
        active
        title={false}
        pRows={3}
        pWidth={[200, 150, 50]}
        pHeight={[125, 10, 20]}
        loading={loader}
        containerStyles={styles.loader}
      />
      <TouchableOpacity key={index} style={loader ? styles.default : styles.dailyMenu} onPress={() => {
        if (
          !isEmpty(cartProducts) &&
          cartRestaurant.restaurant_id != dailyMenu.item.restaurant_id
        ) {
          onModal(dailyMenu.item.restaurant_name);
        } else {
          onDetail(dailyMenu.item);
        }
      }}>
        <FastImage style={styles.image} source={{ uri: RES_URL + dailyMenu.item.product_imageUrl }} onLoadEnd={(e) => setLoader(false)} />
        <View style={styles.dailyMenuContent}>
          <Text style={styles.product_description}>
            {dailyMenu.item.product_description}
          </Text>
          {!isEmpty(dailyMenu.item.startTime) && !isEmpty(dailyMenu.item.endTime) && (
            <Text style={styles.dailyOpenCloseTime} numberOfLines={1}>
              <Text style={styles.dailyOpenCloseTimeTitle}>{i18n.translate("Order time")}</Text>
              {": "}{dailyMenu.item.startTime}-{dailyMenu.item.endTime}
            </Text>
          )}
          <Text style={styles.product_price}>
            {dailyMenu.item.product_price} {i18n.translate("lei")}
          </Text>
        </View>


      </TouchableOpacity>
    </Fragment>
  )
}

export default DailyMenu = (props) => {
  useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

  const { cartRestaurant, cartProducts } = useSelector((state) => state.food);

  return (
    <Card key='dailyMenu' style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{i18n.translate('Daily menu')}</Text>
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.data}
        keyExtractor={(dailyMenu, index) => index.toString()}
        renderItem={(dailyMenu, index) => (
          <RenderItem
            cartRestaurant={cartRestaurant}
            cartProducts={cartProducts}
            dailyMenu={dailyMenu}
            index={index}
            onDetail={(item) => props.onExtra(item)}
            onModal={(restaurant_name) => props.onModal(restaurant_name)}
          />
        )}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 20
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    width: '60%'
  },
  cardCount: {
    textAlign: 'right',
    color: '#666',
    width: '40%'
  },
  loader: {
    marginTop: -10,
    marginRight: 16,
    width: 200,
  },
  default: {
    width: 0
  },
  dailyMenu: {
    marginRight: 16,
    width: 160,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderColor: colors.WHITE,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: Platform.OS === "ios" ? 0.5 : 0.7,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 5
  },
  image: {
    width: '100%',
    height: 105,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  dailyMenuContent: {
    padding: 5,
    backgroundColor: colors.WHITE
  },
  product_description: {
    fontSize: 11
  },
  product_price: {
    textAlign: 'center',
    color: colors.YELLOW.PRIMARY,
    fontSize: 11,
    fontWeight: '700'
  },
  dailyOpenCloseTime: {
    fontSize: 11,
    paddingVertical: 5
  },
  dailyOpenCloseTimeTitle: {
    fontSize: 11,
    fontWeight: '700'
  }
});