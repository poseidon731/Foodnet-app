import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, LogBox, FlatList, View, Image, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Card from '../Athena/Card';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';
import moment from 'moment';

export default Result = (props) => {
  const [nowTime, setNowTime] = useState(moment().format('HH:mm').replace(':', ''));
  
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const renderItem = (result, index) => {
    return (
      <TouchableOpacity key={index} style={styles.result}>
        <Image style={styles.image} source={{ uri: RES_URL + result.item.restaurant_profileImage, cache: 'force-cache' }} />
        {(result.item.restaurant_new > 0 || result.item.restaurant_discount > 0) && (
          <View style={styles.tagView}>
            {result.item.restaurant_new > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{i18n.translate('NEW RESTAURANT')}</Text>
                </View>
              </View>
            )}
            {result.item.restaurant_discount > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{i18n.translate('SPECIAL PRICE')}</Text>
                </View>
              </View>
            )}
          </View>
        )}
        {(parseInt(nowTime) < parseInt(result.item.restaurant_open.replace(':', '')) || parseInt(nowTime) > parseInt(result.item.restaurant_close.replace(':', ''))) && (
          <View style={styles.overlay}>
            <Text style={styles.closeText}>{i18n.translate('CLOSED')}</Text>
          </View>
        )}
        <View style={styles.titleView}>
          <Text style={[styles.title, (parseInt(nowTime) < parseInt(result.item.restaurant_open.replace(':', '')) || parseInt(nowTime) > parseInt(result.item.restaurant_close.replace(':', ''))) && styles.disabled]} numberOfLines={1}>{result.item.restaurant_name}</Text>
          <View style={styles.rating}>
            <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
            <Text style={styles.rate}>{result.item.restaurant_rating}/5</Text>
          </View>
        </View>
        <Text style={[styles.description, (parseInt(nowTime) < parseInt(result.item.restaurant_open.replace(':', '')) || parseInt(nowTime) > parseInt(result.item.restaurant_close.replace(':', ''))) && styles.disabled]} numberOfLines={2}>{result.item.restaurant_description}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <Card key='result' style={styles.card}>
      <Text style={styles.cardTitle}>{i18n.translate('All restaurants')}</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={props.data}
        keyExtractor={(result, index) => index.toString()}
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
  cardTitle: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111'
  },
  result: {
    marginBottom: 30,
    width: '100%',
  },
  image: {
    width: '100%',
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
  tagView: {
    position: 'absolute',
    flexDirection: 'column',
    top: 16,
    left: 16
  },
  tag: {
    padding: 5,
    backgroundColor: colors.YELLOW.PRIMARY,
    borderRadius: 4,
    marginBottom: 10
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.WHITE
  },
  titleView: {
    marginTop: 12,
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
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
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21
  },
  disabled: {
    opacity: 0.5
  }
});