import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Content } from 'native-base';
import { TextField } from 'react-native-material-textfield';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { setToken } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail, validatePassword, validateLength } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { BackIcon, GoogleIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default SignIn = (props) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        (isEmpty(email) || !validateEmail(email)) ? setErrorEmail(i18n.translate('Email is not valid')) : setErrorEmail('');
        (isEmpty(password) || !validateLength(password, 3)) ? setErrorPassword(i18n.translate('Incorrect password')) : setErrorPassword('');
    }, [email, password]);

    const onLogin = async () => {
        setLoading(true);
        await AuthService.login(email, password)
            .then((response) => {
                if (response.status == 200) {
                    setLoading(false);
                    dispatch(setToken(response.result[0].token));
                    props.navigation.navigate('App');
                } else {
                    Toast.show(response.msg, Toast.LONG);
                    setTimeout(() => setLoading(false), 1000);
                }
            })
            .catch((error) => {
                Toast.show(error.message, Toast.LONG);
                setTimeout(() => setLoading(false), 1000);
            });
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Loading loading={loading} />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <BackIcon style={common.headerLeftIcon} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Log in')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                <View style={styles.inputView}>
                    <Text style={[styles.labelText, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('E-mail')}</Text>
                    <TextField
                        keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={email}
                        error={errorEmail}
                        containerStyle={[styles.textContainer, !isEmpty(errorEmail) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        onChangeText={(value) => setEmail(value)}
                    />
                </View>
                <View style={[styles.inputView, common.marginTop50]}>
                    <View style={styles.labelView}>
                        <Text style={[styles.labelText, !isEmpty(errorPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Password')}</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Forgot')}>
                            <Text style={[styles.labelText, common.fontColorYellow]}>{i18n.translate('Reset password')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        clearTextOnFocus={true}
                        value={password}
                        error={errorPassword}
                        secureTextEntry={secureTextEntry}
                        containerStyle={[styles.textContainer, !isEmpty(errorPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry(!secureTextEntry)} />
                            )
                        }}
                        onChangeText={(value) => setPassword(value)}
                    />
                </View>
                <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe(!rememberMe)}>
                    <Icon
                        type='material-community'
                        name={rememberMe ? 'check-box-outline' : 'checkbox-blank-outline'}
                        size={25}
                        color={colors.GREY.PRIMARY}
                    />
                    <Text style={styles.rememberText}>{i18n.translate('Keep me logged in')}</Text>
                </TouchableOpacity>
                <View style={[styles.buttonView, common.marginTop35]}>
                    <TouchableOpacity
                        disabled={isEmpty(email) || isEmpty(password) || errorEmail || errorPassword ? true : false}
                        style={[common.button, (isEmpty(email) || isEmpty(password) || errorEmail || errorPassword) ? common.backColorGrey : common.backColorYellow]}
                        onPress={() => onLogin()}
                    >
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Log in')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.buttonView, common.marginTop25]}>
                    <TouchableOpacity style={styles.googleButton} onPress={() => alert(i18n.translate('Google Log in'))}>
                        <GoogleIcon />
                        <Text style={[styles.googleButtonText, common.fontColor444]}>{i18n.translate('Google Log in')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={common.height50} />
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    inputView: {
        marginTop: 20,
        width: '100%'
    },
    labelView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    textContainer: {
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
    },
    inputContainer: {
        marginTop: -10,
        borderWidth: 0
    },
    rememberMe: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 40,
        width: '100%',
    },
    rememberText: {
        marginLeft: 10,
        fontSize: 16,
    },
    buttonView: {
        width: '100%',
        alignItems: 'center'
    },
    googleButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#C4C4C4'
    },
    googleButtonText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    }
});
