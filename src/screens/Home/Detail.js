import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, SafeAreaView, FlatList, View, Text, Animated, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartProducts, setCartBadge } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { isEmpty, callOnceInInterval } from '@utils/functions';
import { Menu, Information, Reviews } from '@components';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import { BackWhiteIcon, CartYellowIcon, CartWhiteIcon, CheckIcon } from '@constants/svgs';
import i18n from '@utils/i18n';

import moment from 'moment';
import { TabView, TabBar } from 'react-native-tab-view';

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const BOTTOM_BUTTON_DISTANCE = Platform.OS === 'ios' ? 40 : 26;

export default Detail = (props) => {
    const dispatch = useDispatch();
    const { country } = useSelector(state => state.auth);
    const { filters, cartRestaurant, cartBadge, cartProducts, cartToast } = useSelector(state => state.food);

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'menu', title: i18n.translate('MENU') },
        { key: 'info', title: i18n.translate('INFORMATION & PROMOTIONS') },
        { key: 'third', title: i18n.translate('EVALUATION') },
    ]);

    const [restaurant, setRestaurant] = useState(props.route.params.restaurant);
    const [filterList, setFilterList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({
        category_id: 0,
        category_name: ''
    });
    const [subCategories, setSubCategories] = useState([]);
    const [subCategory, setSubCategory] = useState({
        ordered: 0,
        subcategoryId: 0,
        propertyValTransId: 0,
        subcategories_name: '',
        index: 0
    });
    const [information, setInformation] = useState({
        restaurant_id: 0,
        restaurant_avgTransport: 0,
        restaurant_discount: 1,
        restaurant_phoneNumber: '',
        restaurant_address: '',
        restaurant_description: ''
    });
    const [search, setSearch] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [first, setFirst] = useState(false);
    const [modal, setModal] = useState(false);
    const [total, setTotal] = useState(0);

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });
    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });
    const headerBottomTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, HEADER_MAX_HEIGHT],
        extrapolate: 'clamp',
    });
    const headerTopTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, 0],
        extrapolate: 'clamp',
    });
    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_SCROLL_DISTANCE / 2 - 30, 20],
        extrapolate: 'clamp',
    });
    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        var tempFilters = [];
        if (filters.freeDelivery == 1) tempFilters = [...tempFilters, { filter: i18n.translate('No shipping costs') }];
        if (filters.newest == 1) tempFilters = [...tempFilters, { filter: i18n.translate('News') }];
        if (filters.pizza == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Pizza') }];
        if (filters.hamburger == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Hamburger') }];
        if (filters.dailyMenu == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Daily menu') }];
        if (filters.soup == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Soup') }];
        if (filters.salad == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Salat') }];
        if (filters.money == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Cash') }];
        if (filters.card == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Card') }];
        if (filters.withinOneHour == 1) tempFilters = [...tempFilters, { filter: i18n.translate('Within 1 hour') }];
        setFilterList(tempFilters);
        // dispatch(setLoading(true));
        console.log("--category-- country = ", country, "  :  restaurant id = ", restaurant.restaurant_id);
        FoodService.categories(country, restaurant.restaurant_id)
            .then(async (response) => {
                if (response.status == 200) {
                    setCategories(response.result);
                    if (!isEmpty(response.result)) {
                        setCategory(response.result[0]);
                    }
                }
            })
            .catch((error) => {
                // dispatch(setLoading(false));
            });
        FoodService.information(country, restaurant.restaurant_name)
            .then((response) => {
                if (response.status == 200) {
                    setInformation(response.result[0]);
                }
            })
    }, [restaurant]);

    useEffect(() => {
        // dispatch(setLoading(true));
        if (category.category_id != 0) {
            console.log("--subcategory-- country = ", country, "  :  restaurant id = ", restaurant.restaurant_id, "  :  category id = ", category.category_id);
            FoodService.subCategories(country, restaurant.restaurant_id, category.category_id)
                .then(async (response) => {
                    // dispatch(setLoading(false));
                    if (response.status == 200) {
                        var data = [];
                        for (var i = 0; i < response.result.length; i++) {
                            data.push({
                                ordered: response.result[i].ordered,
                                subcategoryId: response.result[i].subcategoryId,
                                propertyValTransId: response.result[i].propertyValTransId,
                                subcategories_name: response.result[i].subcategories_name,
                                index: i
                            })
                        }
                        setSubCategories(data);
                        if (!isEmpty(response.result)) {
                            if (category.category_name === 'Daily Menu' || category.category_name === 'Daily menu' || category.category_name === 'Meniul Zilei' || category.category_name === 'Meniul zilei' || category.category_name === 'Napi Menü' || category.category_name === 'Napi menü') {
                                var d = new Date();
                                var n = d.getDay();
                                setSubCategory({
                                    ordered: response.result[n === 0 ? 6 : n - 1].ordered,
                                    subcategoryId: response.result[n === 0 ? 6 : n - 1].subcategoryId,
                                    propertyValTransId: response.result[n === 0 ? 6 : n - 1].propertyValTransId,
                                    subcategories_name: response.result[n === 0 ? 6 : n - 1].subcategories_name,
                                    index: (n === 0 ? 6 : n - 1)
                                });
                            } else {
                                setSubCategory({
                                    ordered: response.result[0].ordered,
                                    subcategoryId: response.result[0].subcategoryId,
                                    propertyValTransId: response.result[0].propertyValTransId,
                                    subcategories_name: response.result[0].subcategories_name,
                                    index: 0
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log("getting subcategory - ", error);
                    // dispatch(setLoading(false));
                });
        }

    }, [category]);

    useEffect(() => {
        // dispatch(setLoading(true));
        FoodService.reviews(restaurant.restaurant_name, rating)
            .then(async (response) => {
                // dispatch(setLoading(false));
                if (response.status == 200 && !isEmpty(response.result)) {
                    setReviews(response.result[0].ratings);
                    setAverage(response.result[0].AVGrating);
                }
            })
            .catch((error) => {
                // dispatch(setLoading(false));
            });
    }, [rating]);

    useEffect(() => {
        if (first) {
            setVisible(true);
            setTimeout(() => setVisible(false), 3000);
        } else {
            setFirst(true);
        }
    }, [cartToast]);

    useEffect(() => {
        var totalAmount = 0;
        cartProducts.map((cartProduct, key) => {
            totalAmount += cartProduct.quantity * cartProduct.productPrice;
            if (cartProduct.boxPrice)
                totalAmount += cartProduct.quantity * cartProduct.boxPrice;
            cartProduct.extras.map((extra, key) => {
                totalAmount += extra.quantity * extra.extraPrice;
            });
        });
        setTotal(totalAmount);
    });

    return (
        <SafeAreaView style={styles.saveArea}>
            <Animated.ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}
                onScrollBeginDrag={() => setVisible(false)}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
                <TabView navigationState={{ index, routes }}
                    swipeEnabled={Platform.OS === 'ios' ? true : false}
                    renderTabBar={(props) => (
                        <TabBar {...props}
                            scrollEnabled={true}
                            style={styles.tabBar}
                            tabStyle={{ width: 'auto' }}
                            indicatorStyle={styles.tabIndicator}
                            renderLabel={({ route, focused }) => (
                                <Text style={[styles.tabLabel, { color: focused ? colors.YELLOW.PRIMARY : '#333' }]}>{route.title}</Text>
                            )}
                        />)}
                    renderScene={({ route, jumpTo }) => {
                        switch (route.key) {
                            case 'menu':
                                return <Menu
                                    jumpTo={jumpTo}
                                    restaurant={restaurant}
                                    categories={categories}
                                    category={category}
                                    subCategories={subCategories}
                                    subCategory={subCategory}
                                    search={search}
                                    onCategory={(value) => setCategory(value)}
                                    onSubCategory={(value) => setSubCategory(value)}
                                    // onSubCategory={(value) => console.log(value)}
                                    onSearch={(value) => { setSearch(value); console.log("set search - ", value); }}
                                    onExtra={(product, count) => callOnceInInterval(() => props.navigation.push('Extra', { restaurant, product, count }))}
                                    onCart={() => props.navigation.navigate('Cart')}
                                    onModal={() => setModal(true)}
                                />;
                            case 'info':
                                return <Information information={information} jumpTo={jumpTo} />;
                            case 'third':
                                return <Reviews reviews={reviews} average={average} rating={rating} onRating={(value) => setRating(value)} jumpTo={jumpTo} />;
                        }
                    }}
                    onIndexChange={setIndex}
                />
                {(cartBadge > 0) ? (
                    <View style={{ height: 100 }} />
                ) : (
                    <View style={{ height: 20 }} />
                )}
                
            </Animated.ScrollView>

            <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                <Animated.View style={[styles.headerBackgroundGrey, { transform: [{ translateY: imageTranslateY }] }]} />
                <Animated.Image style={[styles.headerBackground, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: RES_URL + restaurant.restaurant_coverImage }} />
                <Animated.View style={[styles.headerBottom, { transform: [{ translateY: headerBottomTranslateY }] }]}>
                    <View style={styles.avatar}>
                        <Image style={styles.avatarView} source={{ uri: RES_URL + restaurant.restaurant_profileImage }} resizeMode="contain" />
                    </View>
                    <View>
                        <View style={styles.statusView}>
                            <View style={[styles.statusItem, (parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(restaurant.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(restaurant.restaurant_close.replace(':', ''))) ? styles.statusRed : styles.statusGreen]}>
                                <Text style={styles.statusText}>{(parseInt(moment().format('HH:mm').replace(':', '')) <= parseInt(restaurant.restaurant_open.replace(':', '')) || parseInt(moment().format('HH:mm').replace(':', '')) >= parseInt(restaurant.restaurant_close.replace(':', ''))) ? i18n.translate('CLOSED') : i18n.translate('OPEN')}</Text>
                            </View>
                        </View>
                        <FlatList
                            style={styles.typeList}
                            contentContainerStyle={styles.flatList}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={filterList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item, index) => (
                                <TouchableOpacity key={index} style={styles.typeItem}>
                                    <Text style={styles.typeText}>{item.item.filter}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Animated.View>
            </Animated.View>
            <Animated.View style={[styles.headerTop, { transform: [{ translateY: headerTopTranslateY }] }]}>
                <Header style={styles.headerContent}>
                    <View style={common.headerLeft}>
                        <TouchableOpacity onPress={() => props.navigation.pop()}>
                            <BackWhiteIcon />
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={[{ transform: [{ translateY: titleTranslateY }] }]}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{restaurant.restaurant_name}</Text>
                        <Animated.View style={[styles.headerMiddle, { opacity: titleOpacity }]}>
                            <View style={{ height: 25 }}>
                                {/* <Icon type='material' name='star-border' size={15} color={colors.YELLOW.PRIMARY} />
                                <Text style={styles.headerRate}>{isEmpty(average) ? 0 : average}/5</Text> */}
                                <Text> </Text>
                            </View>
                        </Animated.View>
                    </Animated.View>
                    <View style={common.headerRight}>
                    </View>
                </Header>
            </Animated.View>
            {cartBadge > 0 && (
                <View style={styles.gotToCartView}>
                    <TouchableOpacity
                        style={styles.goToCart}
                        onPress={() => props.navigation.navigate('Cart')}
                    >
                        <View style={styles.cartBadgeView}><Text style={styles.cartBadgeText}>{cartBadge}</Text></View>
                        <Text style={styles.goToCartText}>{i18n.translate('Go to cart')}</Text>
                        <Text style={styles.priceText}>{total.toFixed(2)} {i18n.translate("lei")}</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* {visible && (
                <TouchableOpacity style={styles.toast} onPress={() => setVisible(false)}>
                    <CheckIcon />
                    <Text style={styles.toastText}>{i18n.translate('Product in the cart')}</Text>
                </TouchableOpacity>
            )} */}
            {modal && (
                <View style={styles.modalContainer}>
                    <View style={styles.overlay} />
                    <View style={styles.modalView}>
                        <View style={styles.modalMain}>
                            <Text style={styles.modalTitle}>{i18n.translate('An order can only be from one restaurant')}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            setModal(false);
                            setRestaurant(cartRestaurant);
                        }}>
                            <Text style={styles.saveText}>{i18n.translate('Back to the')} {cartRestaurant.restaurant_name} {i18n.translate('restaurant')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            setModal(false);
                            // dispatch(setCartRestaurant(null));
                            dispatch(setCartBadge(0));
                            dispatch(setCartProducts([]));
                        }}>
                            <Text style={styles.cancelText}>{i18n.translate('Empty cart add new product to the cart')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    saveArea: {
        flex: 1,
        backgroundColor: colors.WHITE,
        justifyContent: 'center'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00000080',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
        marginTop: 0
    },
    headerBackgroundGrey: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
        zIndex: 2000,
        backgroundColor: "#000000D0"
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    headerContent: {
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        paddingHorizontal: 10,
        elevation: 0
    },
    headerTop: {
        marginTop: Platform.OS === 'ios' ? 40 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerTitle: {
        width: wp('60%'),
        height: 25,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.WHITE,
        textAlign: 'center'
    },
    headerMiddle: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    headerRating: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        width: 50,
        height: 25,
        backgroundColor: '#FEEBD6',
        borderRadius: 6
    },
    headerRate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY
    },
    headerBottom: {
        top: HEADER_MAX_HEIGHT - 50,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('100%'),
        backgroundColor: colors.WHITE,
        zIndex: 2001,
    },
    avatar: {
        marginTop: -55,
        marginLeft: 16,
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        borderWidth: 5,
        borderColor: colors.WHITE,
        backgroundColor: '#C4C4C4',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarView: {
        height: 90,
        width: 90,
    },
    statusView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: -35,
        marginLeft: 20
    },
    statusItem: {
        marginRight: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: '#FEEBD6',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.WHITE,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.WHITE
    },
    statusGreen: {
        backgroundColor: '#4ACC4F'
    },
    statusRed: {
        backgroundColor: '#F05050'
    },
    typeList: {
        marginTop: 20,
        marginLeft: 20,
        width: wp('100%') - 145,
        height: 50
    },
    flatList: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    typeItem: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#FEEBD6',
        borderRadius: 6,
        marginRight: 8
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY,
    },
    content: {
        paddingTop: HEADER_MAX_HEIGHT - 32
    },
    tabBar: {
        paddingTop: Platform.OS == 'ios' ? -10 : 30,
        backgroundColor: colors.WHITE,
        borderBottomWidth: 2,
        borderBottomColor: '#C4C4C4',
        elevation: 0
    },
    tabIndicator: {
        marginLeft: 10,
        backgroundColor: colors.YELLOW.PRIMARY,
        height: 3,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: 'bold'
    },
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
    toast: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom: 0,
        paddingLeft: 50,
        width: wp('100%'),
        height: 60,
        backgroundColor: '#FEEBD6',
        shadowColor: colors.BLACK,
        shadowOffset: { width: 4, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10
    },
    toastText: {
        marginLeft: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F78F1E'
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
        // height: 230,
        backgroundColor: '#1E1E1E',
        borderRadius: 14,
    },
    modalMain: {
        justifyContent: 'center',
        alignItems: 'center',
        // height: 120
    },
    modalTitle: {
        width: '80%',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.WHITE,
        paddingTop: 15,
        paddingBottom: 5
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
    gotToCartView: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: BOTTOM_BUTTON_DISTANCE,
        paddingTop: 14,
        paddingHorizontal: 14,
        width: wp('100%'),
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 4, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    goToCart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        height: 42,
        borderRadius: 6,
        backgroundColor: "#F78F1E",
        width: wp('100%') - 30,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 4, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    cartBadgeView: {
        padding: 5,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.WHITE,
        width: 25,
        height: 25,
        justifyContent: 'center'
    },
    cartBadgeText: {
        color: colors.WHITE,
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'center'
    },
    goToCartText: {
        color: colors.WHITE,
        fontSize: 15,
        fontWeight: '600'
    },
    priceText: {
        color: colors.WHITE,
        fontSize: 13,
        fontWeight: '700'
    }
});