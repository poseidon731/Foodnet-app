import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import Toast from 'react-native-simple-toast';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { setToken, setUser } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty, validateEmail, validatePassword } from '@utils/functions';
import { themes, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { BackIcon, GoogleIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: 'erdosjozsef20@gmail.com',
            errorEmail: false,
            password: '123456',
            errorPassword: false,
            secureTextEntry: true,
            rememberMe: false,
        };
    }
    onValidateEmail(email) {
        this.setState({ email }, () => {
            if (isEmpty(this.state.email) || !validateEmail(this.state.email)) {
                this.setState({ errorEmail: true });
            } else {
                this.setState({ errorEmail: false });
            }
        })
    }

    onValidatePassword(password) {
        this.setState({ password }, () => {
            if (isEmpty(this.state.password) || !validatePassword(this.state.password)) {
                this.setState({ errorPassword: true });
            } else {
                this.setState({ errorPassword: false });
            }
        })
    }

    async onLogin() {
        if (isEmpty(this.state.email)) {
            Toast.show('Email is required', Toast.LONG);
        } else if (!isEmpty(this.state.email) && this.state.errorEmail) {
            Toast.show('Invalid email', Toast.LONG);
        } else if (isEmpty(this.state.password)) {
            Toast.show('Password is required', Toast.LONG);
        } else if (!isEmpty(this.state.password) && this.state.errorPassword) {
            Toast.show('Password should be 3+ characters', Toast.LONG);
        } else if (!isEmpty(this.state.email) && !isEmpty(this.state.password) && !this.state.errorEmail && !this.state.errorPassword) {
            this.setState({ loading: true });
            await AuthService.login(this.state.email, this.state.password)
                .then((response) => {
                    this.setState({ loading: false });
                    if (!isEmpty(response.token)) {
                        this.props.setToken(response.token);
                        this.props.navigation.navigate('Home');
                    }
                })
                .catch((error) => {
                    Toast.show('Invalid credential', Toast.LONG);
                    setTimeout(() => {
                        this.setState({ loading: false });
                    }, 1000)
                });
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <StatusBar />
                <Loading loading={this.state.loading} />
                <Header style={styles.header}>
                    <Left style={{ paddingLeft: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
                        <Text style={styles.labelText}>{i18n.translate('E-mail')}</Text>
                        <TextField
                            keyboardType='email-address'
                            autoCapitalize='none'
                            returnKeyType='next'
                            autoCorrect={false}
                            enablesReturnKeyAutomatically={true}
                            value={this.state.email}
                            fontSize={16}
                            containerStyle={[styles.textContainer, { borderColor: this.state.errorEmail ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
                            inputContainerStyle={styles.inputContainer}
                            onChangeText={(value) => this.onValidateEmail(value)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <View style={styles.labelView}>
                            <Text style={styles.labelText}>{i18n.translate('Password')}</Text>
                            <TouchableOpacity onPress={() => alert(i18n.translate('Reset password'))}>
                                <Text style={[styles.labelText, { color: colors.YELLOW.PRIMARY }]}>{i18n.translate('Reset password')}</Text>
                            </TouchableOpacity>
                        </View>
                        <TextField
                            autoCapitalize='none'
                            returnKeyType='done'
                            autoCorrect={false}
                            enablesReturnKeyAutomatically={true}
                            clearTextOnFocus={true}
                            value={this.state.password}
                            secureTextEntry={this.state.secureTextEntry}
                            fontSize={16}
                            containerStyle={[styles.textContainer, { borderColor: this.state.errorPassword ? colors.RED.PRIMARY : colors.GREY.PRIMARY }]}
                            inputContainerStyle={styles.inputContainer}
                            renderRightAccessory={() => {
                                let name = this.state.secureTextEntry ? 'eye' : 'eye-off';
                                return (
                                    <Icon name={name} type='feather' size={24} color={TextField.defaultProps.baseColor} onPress={() => this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }))} />
                                )
                            }}
                            onChangeText={(value) => this.onValidatePassword(value)}
                        />
                    </View>
                    <TouchableOpacity style={styles.rememberMe} onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}>
                        <Icon
                            type='material-community'
                            name={this.state.rememberMe ? 'check-box-outline' : 'checkbox-blank-outline'}
                            size={25}
                            color={colors.GREY.PRIMARY}
                        // color={this.state.rememberMe ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY}
                        />
                        <Text style={styles.rememberText}>{i18n.translate('Keep me logged in')}</Text>
                    </TouchableOpacity>
                    <View style={[styles.buttonView, { marginTop: 35 }]}>
                        <TouchableOpacity
                            disabled={isEmpty(this.state.email) || isEmpty(this.state.password) || this.state.errorEmail || this.state.errorPassword ? true : false}
                            style={[styles.button, {
                                backgroundColor: isEmpty(this.state.email) || isEmpty(this.state.password) || this.state.errorEmail || this.state.errorPassword ? colors.GREY.PRIMARY : colors.YELLOW.PRIMARY
                            }]}
                            onPress={() => this.onLogin()}
                        >
                            <Text style={[styles.buttonText, { color: colors.WHITE }]}>{i18n.translate('Log in')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.buttonView, { marginTop: 25 }]}>
                        <TouchableOpacity style={styles.googleButton} onPress={() => alert(i18n.translate('Google Log in'))}>
                            <GoogleIcon style={styles.logoIcon} />
                            <Text style={[styles.googleButtonText, { color: '#444' }]}>{i18n.translate('Google Log in')}</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
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
        width: wp('40%'),
        height: 50,
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
        paddingLeft: 20,
        paddingRight: 20,
        height: 50,
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


const mapDispatchToProps = dispatch => {
    return {
        setToken: (data) => {
            dispatch(setToken(data));
        }
    }
}

export default connect(undefined, mapDispatchToProps)(SignIn);