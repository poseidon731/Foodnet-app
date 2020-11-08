import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Left, Right } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import Toast from 'react-native-simple-toast';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { deleteToken } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { isEmpty } from '@utils/functions';
import { themes, colors } from '@constants/themes';
import { images, icons } from '@constants/assets';
import { BackIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    onLogout() {
        this.props.deleteToken();
        this.props.navigation.reset({
            index: 1,
            routes: [
                { name: 'Splash' }
            ]
        })
    }

    render() {
        return (
            <Container style={styles.container}>
                <StatusBar />
                <Header style={styles.header}>
                    <Left style={{ paddingLeft: 10 }}>
                        <TouchableOpacity onPress={() => this.onLogout()}>
                            <BackIcon style={styles.backIcon} />
                        </TouchableOpacity>
                    </Left>
                    <Title>
                        <Text style={styles.titleText}>{i18n.translate('Home')}</Text>
                    </Title>
                    <Right style={{ paddingRight: 10 }} />
                </Header>
                <Content style={styles.content}>
                    <View style={styles.inputView}>
                        <Text style={styles.labelText}>{`Token:${this.props.token}`}</Text>
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
});

const mapStateToProps = state => {
    return {
        logged: state.auth.logged,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteToken: (data) => {
            dispatch(deleteToken(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);