import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { themes, colors } from '@constants/themes';

export default class Loading extends Component {
    render() {
        return (
            <View style={[styles.container, { display: this.props.loading ? 'block' : 'none' }]}>
                <ActivityIndicator size="small" color='#FFF' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('50%') - 20,
        marginBottom: 60,
        width: 40,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#00000080',
        shadowColor: colors.BLACK,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    }
});