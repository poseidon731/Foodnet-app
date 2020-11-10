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
import { isEmpty, validatePassword } from '@utils/functions';
import { themes, colors } from '@constants/themes';
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
        isEmpty(password) ? setErrorPassword('Password is required') : !validatePassword(password) ? setErrorPassword(i18n.translate('Incorrect password')) : setErrorPassword('');
        isEmpty(confirm) ? setErrorConfirm('Confirm Password is required') : !validatePassword(confirm) ? setErrorConfirm(i18n.translate('Incorrect password')) : password !== confirm ? setErrorConfirm('Password is not matched') : setErrorConfirm('');
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
        <Container style={styles.container}>
            <StatusBar />
            <Loading loading={loading} />
            <Header style={styles.header}>
                <Left style={{ paddingLeft: 10 }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <BackIcon style={styles.backIcon} />
                    </TouchableOpacity>
                </Left>
                <Title>
                    <Text style={styles.titleText}>{i18n.translate('Set a new password')}</Text>
                </Title>
                <Right style={{ paddingRight: 10 }} />
            </Header>
            <Content style={styles.content}>
                        <Text style={styles.descriptionText}>{i18n.translate('Enter your new password so you can use the app')}</Text>
                <View style={[styles.inputView, { marginTop: 50 }]}>
                    <Text style={[styles.labelText, { color: !isEmpty(errorPassword) ? colors.RED.PRIMARY : colors.BLACK }]}>{i18n.translate('Password')}</Text>
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
                        containerStyle={[styles.textContainer, { borderColor: !isEmpty(errorPassword) ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
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
                <View style={[styles.inputView, { marginTop: 50 }]}>
                    <Text style={[styles.labelText, { color: !isEmpty(errorConfirm) ? colors.RED.PRIMARY : colors.BLACK }]}>{i18n.translate('New password again')}</Text>
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
                        containerStyle={[styles.textContainer, { borderColor: !isEmpty(errorConfirm) ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
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
                <View style={[styles.buttonView, { marginTop: 35 }]}>
                    <TouchableOpacity
                        disabled={isEmpty(password) || isEmpty(confirm) || errorPassword || errorConfirm ? true : false}
                        style={[styles.button, {
                            backgroundColor: isEmpty(password) || isEmpty(confirm) || errorPassword || errorConfirm ? colors.GREY.PRIMARY : colors.YELLOW.PRIMARY
                        }]}
                        onPress={() => onReset()}
                    >
                        <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Save')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 50}} />
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.WHITE
    },
    backIcon: {
        width: 25,
        height: 25
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.BLACK
    },
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
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
