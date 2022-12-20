import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header, Content } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading, setUser } from '@modules/reducers/auth/actions';
import { AuthService } from '@modules/services';
import { isEmpty, validateName, validateEmail, validatePassword, validateMobile } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { BackIcon, ErrorIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import { TextField } from 'react-native-material-textfield';
import { color } from 'react-native-reanimated';

export default SignUp = (props) => {
    const dispatch = useDispatch();
    const { country } = useSelector(state => state.auth);

    const [name, setName] = useState('');
    const [visitName, setVisitName] = useState(false);
    const [errorName, setErrorName] = useState('');
    const [email, setEmail] = useState('');
    const [visitEmail, setVisitEmail] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visitPassword, setVisitPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [visitConfirm, setVisitConfirm] = useState(false);
    const [errorConfirm, setErrorConfirm] = useState('');
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const [secureTextEntry2, setSecureTextEntry2] = useState(true);
    const [termOfService, setTermOfService] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [newsLetter, setNewsLetter] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [mobile, setMobile] = useState('');
    const [visitMobile, setVisitMobile] = useState(false);
    const [errorMobile, setErrorMobile] = useState('');

    useEffect(() => {
        setErrorMsg('');
        (visitName && isEmpty(name)) || (visitName && !validateName(name)) ? setErrorName(i18n.translate('The name must be at least 3 characters long')) : setErrorName('');
        (visitEmail && isEmpty(email)) || (visitEmail && !validateEmail(email)) ? setErrorEmail(i18n.translate('Email is not valid')) : setErrorEmail('');
        (visitMobile && isEmpty(mobile)) || (visitMobile && !validateMobile(mobile)) ? setErrorMobile(i18n.translate('Mobile is not valid')) : setErrorMobile('');
        (visitPassword && isEmpty(password)) || (visitPassword && !validatePassword(password)) ? setErrorPassword(i18n.translate('The password must be at least 6 characters long')) : setErrorPassword('');
        (visitConfirm && isEmpty(confirm)) || (visitConfirm && !validatePassword(confirm)) ? setErrorConfirm(i18n.translate('The password must be at least 6 characters long')) : (confirm.length >= 5 && password !== confirm) ? setErrorConfirm(i18n.translate('The two passwords do not match')) : setErrorConfirm('');
    }, [name, visitName, email, visitEmail, password, visitPassword, confirm, visitConfirm, mobile, visitMobile]);

    const onSignup = () => {
        dispatch(setLoading(true));
        AuthService.register(country, name, email, mobile, password, newsLetter ? 1 : 0)
            .then((response) => {
                dispatch(setLoading(false));
                if (response.status == 200 || response.status == 201) {
                    dispatch(setUser({
                        token: response.result[0].token,
                        email,
                        name: response.result[0].name,
                        city: {
                            id: 0,
                            name: '',
                            status: true
                        }
                    }));
                    props.navigation.replace('Cities');
                } else {
                    setErrorMsg(i18n.translate(response.msg));
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setErrorMsg(error.message);
            });
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <BackIcon style={common.headerLeftIcon} />
                    </TouchableOpacity>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('Registration')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <Content style={styles.content}>
                {!isEmpty(errorMsg) && (
                    <View style={common.errorContainer}>
                        <ErrorIcon />
                        <Text style={common.iconText}>{errorMsg}</Text>
                        <View style={common.width30} />
                    </View>
                )}
                <View style={styles.inputView}>
                    <Text style={[styles.labelText, !isEmpty(errorName) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Name')}</Text>
                    <TextField
                        keyboardType='default'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={name}
                        containerStyle={[styles.textContainer, !isEmpty(errorName) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        lineWidth={0}
                        activeLineWidth={0}
                        onChangeText={(value) => {
                            setName(value);
                            setVisitName(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorName}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop15]}>
                    <Text style={[styles.labelText, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('E-mail')}</Text>
                    <TextField
                        keyboardType='email-address'
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={email}
                        containerStyle={[styles.textContainer, !isEmpty(errorEmail) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        lineWidth={0}
                        activeLineWidth={0}
                        onChangeText={(value) => {
                            setEmail(value);
                            setVisitEmail(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorEmail}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop15]}>
                    <Text style={[styles.labelText, !isEmpty(errorEmail) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Phone number')}</Text>
                    <TextField
                        keyboardType="number-pad"
                        autoCapitalize='none'
                        fontSize={16}
                        autoCorrect={false}
                        value={mobile}
                        containerStyle={[styles.textContainer, !isEmpty(errorMobile) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        lineWidth={0}
                        activeLineWidth={0}
                        ref={(input) => {
                            this.textInput = input;
                        }}
                        onChangeText={(value) => {
                            if(value.length >= 9) {
                                if(value.substr(0, 1) == '0') {
                                    setMobile('+4' + value);
                                    this.textInput.setValue('+4' + value);
                                }
                                else if(value.substr(0, 2) != '40' && value.substr(0, 3) != '+40' && value.substr(0, 1) != '+') {
                                    setMobile('+40' + value);
                                    this.textInput.setValue('+40' + value);
                                } 
                                else if(value.substr(0, 2) == '40') {
                                    setMobile('+' + value);
                                    this.textInput.setValue('+' + value);
                                }
                                else 
                                    setMobile(value);
                            }
                            else
                                setMobile(value);
                            setVisitMobile(true);
                        }}
                    />
                    <View style={styles.phoneDes}>
                        <Text>{i18n.translate('The phone number only for orders')}</Text>
                    </View>
                    <Text style={common.errorText}>{errorMobile}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop15]}>
                    <Text style={[styles.labelText, !isEmpty(errorPassword) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('Password')}</Text>
                    <Text style={styles.characterText}>{i18n.translate('6+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='next'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={password}
                        secureTextEntry={secureTextEntry1}
                        containerStyle={[styles.textContainer, !isEmpty(errorPassword) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        lineWidth={0}
                        activeLineWidth={0}
                        renderRightAccessory={() => {
                            let name = secureTextEntry1 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry1(!secureTextEntry1)} />
                            )
                        }}
                        onChangeText={(value) => {
                            setPassword(value);
                            setVisitPassword(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorPassword}</Text>
                </View>
                <View style={[styles.inputView, common.marginTop15]}>
                    <Text style={[styles.labelText, !isEmpty(errorConfirm) ? common.fontColorRed : common.fontColorBlack]}>{i18n.translate('New password again')}</Text>
                    <Text style={styles.characterText}>{i18n.translate('6+ characters')}</Text>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={confirm}
                        secureTextEntry={secureTextEntry2}
                        containerStyle={[styles.textContainer, !isEmpty(errorConfirm) ? common.borderColorRed : common.borderColorGrey]}
                        inputContainerStyle={styles.inputContainer}
                        lineWidth={0}
                        activeLineWidth={0}
                        renderRightAccessory={() => {
                            let name = secureTextEntry2 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry2(!secureTextEntry2)} />
                            )
                        }}
                        onChangeText={(value) => {
                            setConfirm(value);
                            setVisitConfirm(true);
                        }}
                    />
                    <Text style={common.errorText}>{errorConfirm}</Text>
                </View>
                <TouchableOpacity style={styles.rememberMe} onPress={() => setTermOfService(!termOfService)}>
                    <Icon
                        type='material-community'
                        name={termOfService ? 'check-box-outline' : 'checkbox-blank-outline'}
                        size={25}
                        color={termOfService ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY}
                    />
                    <Text style={styles.rememberText}>{i18n.translate('I accept the ')}
                        <Text style={[styles.rememberText, common.fontColorYellow, common.underLine]} onPress={() => Linking.openURL('http://foodnet.ro/ro/terms')}>{i18n.translate('Terms and Conditions')}</Text>
                    </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.rememberMe} onPress={() => setPrivacy(!privacy)}>
                    <Icon
                        type='material-community'
                        name={privacy ? 'check-box-outline' : 'checkbox-blank-outline'}
                        size={25}
                        color={privacy ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY}
                    />
                    <Text style={styles.rememberText}>{i18n.translate('I accept the ')}
                        <Text style={[styles.rememberText, common.fontColorYellow, common.underLine]} onPress={() => Linking.openURL('http://foodnet.ro/ro/privacy')}>{i18n.translate('Privacy')}</Text>
                    </Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={[styles.rememberMe, common.marginTop10]} onPress={() => setNewsLetter(!newsLetter)}>
                    <Icon
                        type='material-community'
                        name={newsLetter ? 'check-box-outline' : 'checkbox-blank-outline'}
                        size={25}
                        color={newsLetter ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY}
                    />
                    <Text style={styles.rememberText}>{i18n.translate('I subscribe to the newsletter')}</Text>
                </TouchableOpacity>
                <View style={[styles.buttonView, common.marginTop35]}>
                    <TouchableOpacity
                        disabled={isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(confirm) || errorName || errorEmail || errorPassword || errorConfirm || !termOfService || errorMsg || errorMobile ? true : false}
                        style={[common.button, (isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(confirm) || errorName || errorEmail || errorPassword || errorConfirm || !termOfService || errorMsg || errorMobile) ? common.backColorGrey : common.backColorYellow]}
                        onPress={() => onSignup()}
                    >
                        <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Registration')}</Text>
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
    rememberMe: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        width: '100%',
    },
    rememberText: {
        marginLeft: 10,
        fontSize: 16,
        paddingRight: 30,
    },
    buttonView: {
        width: '100%',
        alignItems: 'center'
    },
    phoneDes: {
        paddingVertical: 5,
        color: colors.GREY.PRIMARY
    }
});
