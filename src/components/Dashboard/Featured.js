import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';

import moment from 'moment';
import FastImage from 'react-native-fast-image';
import ContentLoader, { FacebookLoader, InstagramLoader, Bullets } from 'react-native-easy-content-loader';

export default Featured = (props) => {
  useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']), []);

  const renderItem = (featured, index) => {
    return (
      <TouchableOpacity key={index} style={styles.featured} onPress={() => props.onDetail(featured.item)}>
        <FastImage style={styles.image} source={{ uri: RES_URL + featured.item.restaurant_coverImage }} />
        {(parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(featured.item.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(featured.item.restaurant_close.replace(':', ''))) && (
          <View style={styles.overlay}>
            <Text style={styles.closeText}>{i18n.translate('CLOSED')}</Text>
          </View>
        )}
        <Text style={[styles.title, (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(featured.item.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(featured.item.restaurant_close.replace(':', ''))) && styles.disabled]} numberOfLines={1}>{featured.item.restaurant_name}</Text>
        <View style={styles.rating}>
          <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
          <Text style={styles.rate}>{featured.item.restaurant_rating}/5</Text>
        </View>
        <Text style={[styles.description, (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(featured.item.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(featured.item.restaurant_close.replace(':', ''))) && styles.disabled]} numberOfLines={2}>{featured.item.restaurant_description}</Text>
        {/* <View style={{ flexDirection: 'row' }}>
          <Text style={styles.time}>{featured.item.restaurant_open}/{moment().format('HH:mm')}/{featured.item.restaurant_close}</Text>
        </View> */}
      </TouchableOpacity>
    )
  }

  return (
    <Card key='featured' style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{i18n.translate('Featured restaurants')}</Text>
        {props.shown && (<Text style={styles.cardCount}>{i18n.translate('All results')}: {props.count}</Text>)}
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.data}
        keyExtractor={(featured, index) => index.toString()}
        renderItem={renderItem}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: 20
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
  featured: {
    marginRight: 16,
    width: 200,
  },
  image: {
    width: 200,
    height: 125,
    borderRadius: 8
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 125,
    backgroundColor: '#000000D0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.WHITE
  },
  title: {
    width: '100%',
    marginVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111'
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    width: 50,
    height: 25,
    backgroundColor: '#FEEBD6',
    borderRadius: 6
  },
  rate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.YELLOW.PRIMARY
  },
  description: {
    marginVertical: 8,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21
  },
  disabled: {
    opacity: 0.5
  },
  time: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.RED.PRIMARY
  }
});