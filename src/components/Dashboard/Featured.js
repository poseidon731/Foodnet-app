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

export default Featured = (props) => {

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const renderItem = (featured, index) => {
    return (
      <TouchableOpacity key={index} style={styles.featured}>
        <Image style={styles.image} source={{ uri: RES_URL + featured.item.restaurant_profileImage, cache: 'force-cache' }} />
        <Text style={styles.title} numberOfLines={1}>{featured.item.restaurant_name}</Text>
        <View style={styles.rating}>
          <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
          <Text style={styles.rate}>{featured.item.restaurant_rating}/5</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{featured.item.restaurant_description}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Card key='featured' style={styles.card}>
      <Text style={styles.cardTitle}>{i18n.translate('Featured restaurants')}</Text>
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
  cardTitle: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111'
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
  }
});