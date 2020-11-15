import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, BackHandler, StatusBar, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Header } from 'native-base';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setCity } from '@modules/reducers/auth/actions';
import { Loading } from '@components';
import { AuthService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { MapPinIcon } from '@constants/svgs';
import i18n from '@utils/i18n';
import { act } from 'react-test-renderer';

export default Cities = (props) => {
    const dispatch = useDispatch();
    const country = useSelector(state => state.auth.country);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const [citys, setCitys] = useState([]);
    const [visible, setVisible] = useState(false);
    const [cityName, setCityName] = useState('');

    useEffect(() => {
        const handleBackButton = () => {
            return true;
        }
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        const getCities = async () => {
            await AuthService.cities(country)
                .then((response) => {
                    if (response.status == 200) {
                        setLoading(false);
                        setCitys(response.locations);
                        setCityName(response.locations[0].cities);
                    } else {
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
        getCities();

        return () => {
            console.log('cities will be unmount');
        }
    }, []);

    return (
        <Container style={common.container}>
            <StatusBar />
            <Loading loading={loading} />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                </View>
                <View style={common.headerTitle}>
                    <Text style={common.headerTitleText}>{i18n.translate('City selector')}</Text>
                </View>
                <View style={common.headerRight} />
            </Header>
            <View style={styles.content}>
                <View style={styles.inputView}>
                    <Text style={styles.labelText}>{i18n.translate('Where are you looking for a restaurant?')}</Text>
                    <TouchableOpacity style={styles.textContainer} onPress={() => setActive(!active)}>
                        <MapPinIcon />
                        <Text style={styles.itemText} numberOfLines={1}>{cityName}</Text>
                        <Icon type='material' name='keyboard-arrow-down' size={30} color={colors.GREY.PRIMARY} />
                    </TouchableOpacity>
                </View>
                {active ? (
                    <ScrollView style={styles.listView}>
                        {!isEmpty(citys) && citys.map((one, key) => (
                            <TouchableOpacity key={key} style={styles.itemView} onPress={() => {
                                setActive(false);
                                setCityName(one.cities);
                            }}>
                                <Text style={styles.itemText} numberOfLines={1}>{one.cities}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                        <View style={styles.inputView}>
                            <Text style={styles.searchLabel}>{i18n.translate('Quick search:')}</Text>
                            <View style={styles.searchView}>
                                {!isEmpty(citys) ? (
                                    <Fragment>
                                        <TouchableOpacity onPress={() => {
                                            setCityName(citys[0].cities);
                                            setVisible(true);
                                        }}>
                                            <Text style={styles.searchText}>{citys[0].cities}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setCityName(citys[1].cities);
                                            setVisible(true);
                                        }}>
                                            <Text style={styles.searchText}>{citys[1].cities}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setCityName(citys[2].cities);
                                            setVisible(true);
                                        }}>
                                            <Text style={styles.searchText}>{citys[2].cities}</Text>
                                        </TouchableOpacity>
                                    </Fragment>
                                ) : null}
                            </View>
                        </View>
                    )}

            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={[common.button, common.backColorYellow]} onPress={() => {
                    setVisible(false);
                    dispatch(setCity(cityName));
                    props.navigation.navigate('App');
                }} >
                    <Text style={[common.buttonText, common.fontColorWhite]}>{i18n.translate('Save')}</Text>
                </TouchableOpacity>
            </View>
            {visible ?
                <SaveModal
                    cityName={cityName}
                    onSave={() => {
                        setVisible(false);
                        dispatch(setCity(cityName));
                        props.navigation.navigate('App');
                    }}
                    onCancel={() => setVisible(false)} /> : null}
        </Container >
    );
}

const SaveModal = (props) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.modalView}>
                <View style={styles.modalMain}>
                    <Text style={styles.modalTitle}>{i18n.translate('Did you mean this city')}: {props.cityName}?</Text>
                    <Text style={styles.modalDescription}>{i18n.translate('You can edit the city later by clicking on the city in header')}</Text>
                </View>
                <TouchableOpacity style={styles.modalButton} onPress={props.onSave}>
                    <Text style={styles.saveText}>{i18n.translate('Save')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={props.onCancel}>
                    <Text style={styles.cancelText}>{i18n.translate('Cancel')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    inputView: {
        marginTop: 20,
        width: '100%'
    },
    itemText: {
        width: '75%',
        fontSize: 16,
        textAlign: 'left',
    },
    listView: {
        width: '100%',
        height: 300,
        backgroundColor: colors.WHITE,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.GREY.PRIMARY,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    itemView: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.GREY.PRIMARY
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
    searchLabel: {
        fontSize: 16,
        color: colors.BLACK
    },
    searchView: {
        width: '100%',
        flexWrap: "wrap",
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    searchText: {
        marginRight: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: colors.GREY.PRIMARY
    },
    modalContainer: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#00000080'
    },
    modalView: {
        justifyContent: 'space-between',
        width: wp('70%'),
        height: 200,
        backgroundColor: 'rgba(30, 30, 30, 0.75)',
        borderRadius: 14,
    },
    modalMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 110
    },
    modalTitle: {
        width: '80%',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    modalDescription: {
        width: '80%',
        textAlign: 'center',
        fontSize: 13,
        color: colors.WHITE
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 45,
        borderTopWidth: 2,
        borderTopColor: '#1E1E1E'
    },
    saveText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0AB4FF'
    },
    cancelText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#F05050'
    },
    buttonView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('100%'),
        bottom: 50,
    }
});
