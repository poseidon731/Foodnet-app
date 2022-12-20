import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setFilters } from '@modules/reducers/food/actions';
import { setCartProducts, setCartBadge } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { Cities, Dashboard, Filters } from '@components';
import { common, colors } from '@constants/themes';
import { CartYellowIcon } from '@constants/svgs';
import i18n from '@utils/i18n';
import { callOnceInInterval } from '@utils/functions';

export default Home = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);
    const { cartBadge, cartRestaurant, filters } = useSelector(state => state.food);

    const [cityStatus, setCityStatus] = useState(false);
    const [filterStatus, setFilterStatus] = useState(false);
    const [promotion, setPromotion] = useState([]);
    const [popular, setPopular] = useState([]);
    const [result, setResult] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [dailyMenu, setDailyMenu] = useState([]);
    const [modal, setModal] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [promotionHeader, setPromotionHeader] = useState([]);

    useEffect(() => {
        setCityStatus(false);
        setFilterStatus(false);
        dispatch(setLoading(true));
        FoodService.getPromotionHeader(country, logged ? user.city.id : city.id)
            .then(response => {
                console.log(response);
                if(response.status == 200) setPromotionHeader(response.result);
            })
            .catch(error => {
                setRefresh(false);
            });

        console.log("index home = ", logged ? user.city.name : city.name);
        FoodService.getDailyMenu(country, logged ? user.city.id : city.id)
            .then(response => {
                setRefresh(false);
                if(response.status == 200) {
                    setDailyMenu(response.result);
                }
            })
            .catch(error => {
                setRefresh(false);
            })
        FoodService.promotion(country, logged ? user.city.name : city.name)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setPromotion(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
            });
        // FoodService.popular(country, logged ? user.city.name : city.name)
        //     .then((response) => {
        //         setRefresh(false);
        //         if (response.status == 200) {
        //             setPopular(response.result);
        //         }
        //     })
        //     .catch((error) => {
        //         setRefresh(false);
        //     });
        FoodService.all(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                dispatch(setLoading(false));
                setRefresh(false);
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                setRefresh(false);
            });
    }, [country, city, user, refresh, filters]);

    useEffect(() => {
        FoodService.result(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
            });
    }, [search]);

    useEffect(() => {
        function getRestaurantList(country, cityId, cityName, search, filters) {
            console.log((new Date()).getMinutes() + " : " + (new Date()).getSeconds(), "  ==  get restaurant status", cityName);
            FoodService.getDailyMenu(country, cityId)
            .then(response => {
                setRefresh(false);
                if(response.status == 200) {
                    setDailyMenu(response.result);
                }
            })
            .catch(error => {
                setRefresh(false);
            })
            FoodService.promotion(country, cityName)
                .then((response) => {
                    setRefresh(false);
                    if (response.status == 200) {
                        console.log("restaurant = ", response.result[0]);
                        setPromotion(response.result);
                    }
                })
                .catch((error) => {
                    setRefresh(false);
                });

            if (search == '') {
                FoodService.all(country, cityName, search, filters)
                    .then((response) => {
                        dispatch(setLoading(false));
                        setRefresh(false);
                        if (response.status == 200) {
                            setResult(response.result);
                        }
                    })
                    .catch((error) => {
                        dispatch(setLoading(false));
                        setRefresh(false);
                    });
            } else {
                FoodService.result(country, cityName, search, filters)
                    .then((response) => {
                        setRefresh(false);
                        if (response.status == 200) {
                            setResult(response.result);
                        }
                    })
                    .catch((error) => {
                        setRefresh(false);
                    });
            }
        }

        const interval = setInterval(() => getRestaurantList(country, logged ? user.city.id : city.id, logged ? user.city.name : city.name, search, filters), 45000)
        return () => {
            clearInterval(interval);
        }
    }, [country, user, city, search, filters])

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => {
                        setCityStatus(false);
                        props.navigation.openDrawer();
                    }}>
                        <Icon type='ionicon' name='menu' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle} onPress={() => setCityStatus(!cityStatus)}>
                    <Text style={common.headerTitleText}>{!logged ? city.name : user.city.name}</Text>
                    <Icon type='material' name={cityStatus ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color={colors.BLACK} />
                </TouchableOpacity>
                <View style={common.headerRight}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('Cart');
                    }}>
                        {cartBadge > 0 ? (
                            <Fragment>
                                <CartYellowIcon />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartBadge}</Text>
                                </View>
                            </Fragment>
                        ) : (
                                <Fragment>
                                    {/* <CartYellowIcon />
                                    <View style={styles.badgeEmpty} /> */}
                                    <View />
                                </Fragment>
                            )}
                    </TouchableOpacity>
                </View>
            </Header>
            {
                !cityStatus ? !filterStatus ?
                    <Dashboard
                        featured={promotion}
                        trendy={popular}
                        result={result}
                        refresh={refresh}
                        search={search}
                        filters={filters}
                        dailyMenu={dailyMenu}
                        promotionHeader={promotionHeader}
                        onFilter={() => setFilterStatus(!filterStatus)}
                        onRefresh={() => setRefresh(true)}
                        onSearch={(value) => setSearch(value)}
                        onDetail={(item) => callOnceInInterval(() => props.navigation.push('Detail', { restaurant: item }))}
                        onExtra={(item) => callOnceInInterval(() => props.navigation.push('DailyMenuExtra', { item }))}
                        onModal={(restaurant_name) => {setModal(true); setRestaurantName(restaurant_name);}}
                    /> :
                    <Filters
                        filters={filters}
                        onFilters={(value) => {
                            dispatch(setFilters(value));
                            setFilterStatus(false);
                        }}
                        onCancel={() => setFilterStatus(false)}
                    /> :
                    <Cities
                        onSave={() => setCityStatus(false)}
                        onLoading={(load) => dispatch(setLoading(load))}
                    />
            }
            {modal && (
                <View style={styles.modalContainer}>
                    <View style={styles.overlay} />
                    <View style={styles.modalView}>
                        <View style={styles.modalMain}>
                            <Text style={styles.modalTitle}>{i18n.translate('You havent placed your order from the')} {restaurantName} {i18n.translate('yet')}</Text>
                            <Text style={styles.modalDescription}>{i18n.translate('An order can only be from one restaurant')}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            setModal(false);
                            // dispatch(setCartRestaurant(null));
                            dispatch(setCartBadge(0));
                            dispatch(setCartProducts([]));
                        }}>
                            <Text style={styles.cancelText}>{i18n.translate('Empty cart add new product to the cart')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            setModal(false);
                            // setRestaurant(cartRestaurant);
                        }}>
                            {/* <Text style={styles.saveText}>{i18n.translate('Back to the')} {cartRestaurant.restaurant_name} {i18n.translate('restaurant')}</Text> */}
                            <Text style={styles.saveText}>{i18n.translate('Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Container>
    );
}

const styles = StyleSheet.create({
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FEEBD6',
        backgroundColor: colors.YELLOW.PRIMARY,
        marginTop: -30,
        marginLeft: 15
    },
    badgeEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 16,
        height: 16,
        marginTop: -30,
        marginLeft: 15
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
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
        height: 230,
        backgroundColor: '#1E1E1E',
        borderRadius: 14,
    },
    modalMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 120
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
        height: 55,
        borderTopWidth: 2,
        borderTopColor: colors.BLACK
    },
    saveText: {
        width: '80%',
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0AB4FF',
        textAlign: 'center'
    },
    cancelText: {
        width: '80%',
        fontSize: 17,
        fontWeight: 'bold',
        color: '#F05050',
        textAlign: 'center'
    },
});