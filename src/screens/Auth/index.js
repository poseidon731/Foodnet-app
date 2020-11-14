import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { setCountry } from '@modules/reducers/auth/actions';
import { Picker } from '@components';
import { isEmpty } from '@utils/functions';
import { colors, common } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { LogoIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

const titles = [
    "Foodnet coupon code shopping",
    "Foodnet coupon code shopping",
    "Foodnet coupon code shopping",
];

const languages = [
    { value: 0, label: 'English', code: 'en', icon: icons.en },
    { value: 1, label: 'Hungarian', code: 'hu', icon: icons.hu },
    { value: 2, label: 'Romanian', code: 'ro', icon: icons.ro },
];

export default Splash = (props) => {
    const dispatch = useDispatch();
    const country = useSelector(state => state.auth.country);
    const city = useSelector(state => state.auth.city);

    const [lang, setLang] = useState(false);
    const [language, setLanguage] = useState(country === 'en' ? { value: 0, label: 'English', code: 'en' } : country === 'hu' ? { value: 1, label: 'Hungarian', code: 'hu' } : { value: 2, label: 'Romanian', code: 'ro' });

    const onLanguage = (language) => {
        i18n.setLocale(language.code);
        setLanguage(language);
        setLang(false);
        dispatch(setCountry(language.code));
    }

    return (
        <ImageBackground source={images.bgImage} style={common.container}>
            <StatusBar />
            <TouchableOpacity style={styles.logoIcon} onPress={() => setLang(true)}>
                <LogoIcon />
            </TouchableOpacity>
            <View style={styles.descriptionView}>
                <Swiper
                    dotStyle={[styles.dotStyle, common.width10]}
                    activeDotStyle={[styles.dotStyle, common.width20]}
                    dotColor={colors.WHITE}
                    activeDotColor={colors.YELLOW.PRIMARY}
                >
                    {titles.map((title, key) => (
                        <Text key={key} style={styles.descriptionText}>{i18n.translate(title)}</Text>
                    ))}
                </Swiper>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.button, common.backColorYellow]} onPress={() => props.navigation.navigate('Auth', { screen: 'SignUp' })}>
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Registration')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, common.backColorWhite]} onPress={() => props.navigation.navigate('Auth', { screen: 'SignIn' })}>
                        <Text style={[common.buttonText, common.fontColorYellow]}>{i18n.translate('Log in')}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {
                    isEmpty(city) ? props.navigation.navigate('Auth', { screen: 'Cities' }) : props.navigation.navigate('App');
                }}>
                    <Text style={styles.continueText}>{i18n.translate('Continue without registration')}</Text>
                </TouchableOpacity>
            </View>
            {lang && (<Picker data={languages} one={language} onSelect={(item) => onLanguage(item)} />)}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        width: wp('100%'),
        height: hp('100%'),
    },
    logoIcon: {
        top: hp('50%') - 190,
        left: 25,
        width: 100,
    },
    descriptionView: {
        top: hp('50%') - 150,
        left: 25,
        height: 100,
    },
    descriptionText: {
        width: 240,
        height: 72,
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 36,
        color: colors.WHITE,
    },
    dotStyle: {
        marginBottom: -20,
        height: 10,
        borderRadius: 5
    },
    bottomView: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        width: wp('100%'),
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 25,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('40%'),
        paddingVertical: 15,
        borderRadius: 6,
    },
    continueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.WHITE
    }
});