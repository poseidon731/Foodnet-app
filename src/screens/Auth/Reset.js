import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import Toast from 'react-native-simple-toast';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail, validatePassword } from '@utils/functions';
import { themes, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { BackIcon, GoogleIcon } from '@constants/svgs';
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
        if (isEmpty(password) || !validatePassword(password)) {
            setErrorPassword(true);
        } else {
            setErrorPassword(false);
        }
        if (isEmpty(confirm) || !validatePassword(confirm)) {
            setErrorConfirm(true);
        } else {
            setErrorConfirm(false);
        }
    }, [password, confirm])

    const onValidatePassword = (value) => {
        setPassword(value);
    }

    const onValidateConfirm = (value) => {
        setConfirm(value);
    }

    const onReset = async () => {
        if (isEmpty(password)) {
            Toast.show('Password is required', Toast.LONG);
        } else if (!isEmpty(password) && errorPassword) {
            Toast.show('Password should be 3+ characters', Toast.LONG);
        } else if (isEmpty(confirm)) {
            Toast.show('Password is required', Toast.LONG);
        } else if (!isEmpty(confirm) && errorConfirm) {
            Toast.show('Password should be 3+ characters', Toast.LONG);
        } else if (!isEmpty(password) && !isEmpty(confirm) && !errorPassword && !errorConfirm) {
            props.navigation.navigate('SignIn');
        }
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
                    <Text style={styles.titleText}>{i18n.translate('Log in')}</Text>
                </Title>
                <Right style={{ paddingRight: 10 }} />
            </Header>
            <Content style={styles.content}>
                <View style={styles.inputView}>
                    <View style={styles.labelView}>
                        <Text style={styles.labelText}>{i18n.translate('Password')}</Text>
                    </View>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        clearTextOnFocus={true}
                        value={password}
                        secureTextEntry={secureTextEntry1}
                        fontSize={16}
                        containerStyle={[styles.textContainer, { borderColor: errorPassword ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry1 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry(!secureTextEntry)} />
                            )
                        }}
                        onChangeText={(value) => onValidatePassword(value)}
                    />
                </View>
                <View style={styles.inputView}>
                    <View style={styles.labelView}>
                        <Text style={styles.labelText}>{i18n.translate('Password')}</Text>
                    </View>
                    <TextField
                        autoCapitalize='none'
                        returnKeyType='done'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        clearTextOnFocus={true}
                        value={confirm}
                        secureTextEntry={secureTextEntry2}
                        fontSize={16}
                        containerStyle={[styles.textContainer, { borderColor: errorConfirm ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
                        inputContainerStyle={styles.inputContainer}
                        renderRightAccessory={() => {
                            let name = secureTextEntry2 ? 'eye' : 'eye-off';
                            return (
                                <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => setSecureTextEntry1(!secureTextEntry1)} />
                            )
                        }}
                        onChangeText={(value) => onValidateConfirm(value)}
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
                        <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Log in')}</Text>
                    </TouchableOpacity>
                </View>
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
        marginTop: -20,
        borderWidth: 0
    },
    rememberMe: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
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
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: wp('40%'),
        // height: 50,
        padding: 15,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    googleButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // width: wp('60%'),
        // height: 50,
        padding: 15,
        paddingLeft: 20,
        paddingRight: 20,
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
