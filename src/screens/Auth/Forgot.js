import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import Toast from 'react-native-simple-toast';
import CodeInput from 'react-native-code-input';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail } from '@utils/functions';
import { themes, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { BackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

export default Forgot = (props) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState(0);

    // const dispatch = useDispatch();

    useEffect(() => {
        isEmpty(email) ? setErrorEmail('Email is required') : !validateEmail(email) ? setErrorEmail('Email is not valid') : setErrorEmail('');
    }, [email]);

    const onSendCode = async () => {
        setLoading(true);
        await AuthService.sendCode(email)
            .then(async (response) => {
                if (response.status == 200) {
                    await AuthService.verification(email)
                        .then(async (response) => {
                            if (response.status == 200) {
                                setLoading(false);
                                setVisible(true);
                                setCode(response.result[0].code[0].reset_code);
                            } else {
                                Toast.show(response.result[0].msg, Toast.LONG);
                                setTimeout(() => setLoading(false), 1000);
                            }
                        })
                        .catch((error) => {
                            Toast.show(error.message, Toast.LONG);
                            setTimeout(() => setLoading(false), 1000);
                        });
                } else {
                    Toast.show(response.result[0].msg, Toast.LONG);
                    setTimeout(() => setLoading(false), 1000);
                }
            })
            .catch((error) => {
                Toast.show(error.message, Toast.LONG);
                setTimeout(() => setLoading(false), 1000);
            });
    }
    const onFinishCheckingCode = (value) => {
        code == value ? props.navigation.navigate('Reset') : Toast.show('Incorrect Code', Toast.LONG);
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
                    <Text style={styles.titleText}>{i18n.translate('Forgotten Password')}</Text>
                </Title>
                <Right style={{ paddingRight: 10 }} />
            </Header>
            <Content style={styles.content}>
                {!visible ?
                    <React.Fragment>
                        <Text style={styles.descriptionText}>{i18n.translate('Please enter your email address to send us your new password')}</Text>
                        <View style={styles.inputView}>
                            <Text style={styles.labelText}>{i18n.translate('E-mail')}</Text>
                            <TextField
                                disabled={visible}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                returnKeyType='next'
                                fontSize={16}
                                autoCorrect={false}
                                enablesReturnKeyAutomatically={true}
                                value={email}
                                error={errorEmail}
                                containerStyle={[styles.textContainer, { borderColor: !isEmpty(errorEmail) ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
                                inputContainerStyle={styles.inputContainer}
                                onChangeText={(value) => setEmail(value)}
                            />
                        </View>
                        <View style={[styles.buttonView, { marginTop: 50 }]}>
                            <TouchableOpacity
                                disabled={isEmpty(email) || !isEmpty(errorEmail) || visible ? true : false}
                                style={[styles.button, {
                                    backgroundColor: isEmpty(email) || !isEmpty(errorEmail) || visible ? colors.GREY.PRIMARY : colors.YELLOW.PRIMARY
                                }]}
                                onPress={() => onSendCode()}
                            >
                                <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </React.Fragment> :
                    <React.Fragment>
                        <View style={styles.inputView}>
                            <Text style={[styles.labelText, { width: '100%' }]}>{i18n.translate('Confirm Verification Code')}</Text>
                            <Text style={styles.confirmText}>{i18n.translate('A message with a verification code has been sent to your email for reset password Enter the code to continue')}</Text>
                            <CodeInput
                                codeLength={6}
                                size={50}
                                secureTextEntry
                                activeColor={colors.YELLOW.PRIMARY}
                                inactiveColor={'#666'}
                                // autoFocus={false}
                                inputPosition='center'
                                containerStyle={{ marginTop: 10 }}
                                codeInputStyle={{ borderWidth: 1.5 }}
                                onFulfill={(value) => onFinishCheckingCode(value)}
                            />
                            <View style={styles.bottomView}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: colors.YELLOW.PRIMARY }]} onPress={() => onSendCode()} >
                                    <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Resend')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: colors.YELLOW.PRIMARY }]} onPress={() => setVisible(false)} >
                                    <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </React.Fragment>}
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
    confirmView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    confirmText: {
        width: '100%',
        fontSize: 16,
        fontWeight: '400',
        color: '#666',
        lineHeight: 24,
    },
    bottomView: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20
    }
});
