import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Picker } from '@components';
import { colors } from '@constants/themes';
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
    const [lang, setLang] = useState(false);
    const [language, setLanguage] = useState({ value: 0, label: 'English', code: 'en' });

    const onLanguage = (language) => {
        i18n.setLocale(language.code);
        setLanguage(language);
        setLang(false);
    }
    return (
        <ImageBackground source={images.bgImage} style={styles.container}>
            <StatusBar />
            <TouchableOpacity style={styles.logoIcon} onPress={() => setLang(true)}>
                <LogoIcon />
            </TouchableOpacity>
            <View style={styles.titleView}>
                <Swiper
                    dotStyle={{ marginBottom: -20, width: 10, height: 10, borderRadius: 5 }}
                    activeDotStyle={{ marginBottom: -20, width: 20, height: 10, borderRadius: 5 }}
                    dotColor={colors.WHITE}
                    activeDotColor={colors.YELLOW.PRIMARY}
                >
                    {titles.map((title, key) => (
                        <Text key={key} style={styles.titleText}>{i18n.translate(title)}</Text>
                    ))}
                </Swiper>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.YELLOW.PRIMARY }]} onPress={() => props.navigation.navigate('Auth', { screen: 'SignUp' })}>
                        <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Registration')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.WHITE }]} onPress={() => props.navigation.navigate('Auth', { screen: 'SignIn' })}>
                        <Text style={[styles.buttonText, { color: colors.YELLOW.PRIMARY }]}>{i18n.translate('Log in')}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
                    <Text style={styles.continueText}>{i18n.translate('Continue without registration')}</Text>
                </TouchableOpacity>
            </View>
            {lang && (<Picker data={languages} one={language} onSelect={(item) => onLanguage(item)} />)}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        width: wp('100%'),
        height: hp('100%'),
    },
    logoIcon: {
        top: hp('50%') - 190,
        left: 25,
        width: 100,
    },
    titleView: {
        top: hp('50%') - 150,
        left: 25,
        height: 100,
    },
    titleText: {
        width: 240,
        height: 72,
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 36,
        color: colors.WHITE,
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
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    continueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.WHITE
    }
});