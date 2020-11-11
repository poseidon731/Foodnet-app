import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { setToken } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty, validatePassword, validateLength } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { BackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default SignIn = (props) => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [errorConfirm, setErrorConfirm] = useState(false);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const [secureTextEntry2, setSecureTextEntry2] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        (isEmpty(password) || !validateLength(password, 3)) ? setErrorPassword(i18n.translate('Incorrect password')) : setErrorPassword('');
        (isEmpty(confirm) || !validateLength(confirm, 3)) ? setErrorConfirm(i18n.translate('Incorrect password')) : password !== confirm ? setErrorConfirm(i18n.translate('The two passwords do not match')) : setErrorConfirm('');
    }, [password, confirm])

    const onReset = async () => {
        setLoading(true);
        await AuthService.reset(props.route.params.email, password, props.route.params.code)
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
                    <Text style={common.headerTitleText}>{i18n.translate('Set a new password')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                <Text style={styles.descriptionText}>{i18n.translate('Enter your new password so you can use the app')}</Text>
                <View style={[styles.inputView, common.marginTop50]}>
                    <Text style={[styles.labelText, !isEmpty(errorPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Password')}</Text>
                    <Text style={styles.characterText}>{i18n.translate('5+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        clearTextOnFocus={true}
                        value={password}
                        error={errorPassword}
                        secureTextEntry={secureTextEntry1}
                        containerStyle={[styles.textContainer, !isEmpty(errorPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry1 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry1(!secureTextEntry1)} />
                            )
                        }}
                        onChangeText={(value) => setPassword(value)}
                    />
                </View>
                <View style={[styles.inputView, common.marginTop50]}>
                    <Text style={[styles.labelText, !isEmpty(errorConfirm) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('New password again')}</Text>
                    <Text style={styles.characterText}>{i18n.translate('5+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        clearTextOnFocus={true}
                        value={confirm}
                        error={errorConfirm}
                        secureTextEntry={secureTextEntry2}
                        containerStyle={[styles.textContainer, !isEmpty(errorConfirm) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry2 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry2(!secureTextEntry2)} />
                            )
                        }}
                        onChangeText={(value) => setConfirm(value)}
                    />
                </View>
                <View style={[styles.buttonView, common.marginTop35]}>
                    <TouchableOpacity
                        disabled={isEmpty(password) || isEmpty(confirm) || errorPassword || errorConfirm ? true : false}
                        style={[common.button, (isEmpty(password) || isEmpty(confirm) || errorPassword || errorConfirm) ? common.backColorGrey : common.backColorYellow]}
                        onPress={() => onReset()}
                    >
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Save')}</Text>
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
    descriptionText: {
        width: '80%',
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
        lineHeight: 24,
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
    characterText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '400',
        color: '#666'
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
        marginTop: -20,
        borderWidth: 0
    },
    buttonView: {
        width: '100%',
        alignItems: 'center'
    },
});
