import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Content, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, FlatList, View, Text, TouchableOpacity, Animated, Image, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { setCartRestaurant, setCartProducts, setCartBadge, setCartToast } from '@modules/reducers/food/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
import { common, colors } from '@constants/themes';
import { RES_URL } from '@constants/configs';
import i18n from '@utils/i18n';
import moment from 'moment';
import { TextField } from 'react-native-material-textfield';

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const BOTTOM_BUTTON_DISTANCE = Platform.OS === 'ios' ? 40 : 26;

const Required = ({ required, index, quantity, onSelect }) => {
    const [check, setCheck] = useState(false);

    return (
        <Fragment>
            <TouchableOpacity key={index} style={styles.items} onPress={() => {
                setCheck(!check);
                onSelect(!check, required, quantity);
            }}>
                <View style={styles.check}>
                    <Icon type='material' name={check ? 'radio-button-on' : 'radio-button-off'} size={25} color={check ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY} />
                    <Text style={{ fontSize: 16 }}>{required.extra_name}</Text>
                    {/* {!isEmpty(required.allergens_name) ? (
                        <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {required.allergens_name.map((allergen, key) => (
                            <Text key={`allergen${key}`} style={styles.allergen}>{allergen.allergen}{key != required.allergens_name.length - 1 ? ', ' : ''}</Text>
                        ))})</Text>
                    ) : null} */}
                </View>
                <Text style={styles.price}>{(required.extra_price * quantity).toFixed(2)} {i18n.translate('lei')}</Text>
            </TouchableOpacity>
        </Fragment>
    )
}

const Optional = ({ optional, index, quantity, onSelect }) => {
    const [check, setCheck] = useState(false);

    return (
        <Fragment>
            <TouchableOpacity key={index} style={styles.items} onPress={() => {
                setCheck(!check);
                onSelect(!check, optional, quantity);
            }}>
                <View style={styles.check}>
                    <Icon type='material-community' name={check ? 'check-box-outline' : 'checkbox-blank-outline'} size={25} color={check ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY} />
                    <Text style={{ fontSize: 16 }}>{optional.extra_name}</Text>
                    {/* {!isEmpty(optional.allergens_name) ? (
                        <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {optional.allergens_name.map((allergen, key) => (
                            <Text key={`allergensop${key}`} style={styles.allergen}>{allergen.allergen}{key != optional.allergens_name.length - 1 ? ', ' : ''}</Text>
                        ))})</Text>
                    ) : null} */}
                </View>
                <Text style={styles.price}>{(optional.extra_price * quantity).toFixed(2)} {i18n.translate('lei')}</Text>
            </TouchableOpacity>
        </Fragment>
    )
}

export default DailyMenuExtra = (props) => {
    const dispatch = useDispatch();
    const { country } = useSelector(state => state.auth);
    const { cartRestaurant, cartProducts, cartBadge, cartToast } = useSelector(state => state.food);

    // const [restaurant] = useState(props.route.params.restaurant);
    const [product] = useState(props.route.params.item);
    const [quantity, setQuantity] = useState(1);
    const [minRequired, setMinRequired] = useState(0);
    const [requireds, setRequireds] = useState([]);
    const [requiredList, setRequiredList] = useState([]);
    const [requiredsAll, setRequiredsAll] = useState([]);
    const [isShowRequireds, setIsShowRequireds] = useState(false);
    const [optionals, setOptionals] = useState([]);
    const [optionalList, setOptionalList] = useState([]);
    const [optionalsAll, setOptionalsAll] = useState([]);
    const [isShowOptionals, setIsShowOptionals] = useState(false);
    const [comment, setComment] = useState('');

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
    const headerTopTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        console.log(product);
        const getRequired = () => {
            dispatch(setLoading(true));
            FoodService.required(country, product.restaurant_id, product.variant_id)
                .then((response) => {
                    // dispatch(setLoading(false));
                    if (response.status == 200) {
                        setMinRequired(response.minRequired);
                        setRequireds(response.result);
                        console.log("requireds length - ", response.result.length, response.result);

                        if (response.result.length <= 5) setRequiredsAll(response.result);
                        else {
                            let tmp = [];
                            for (var i = 0; i < 5; i++) {
                                tmp.push(response.result[i]);
                            }
                            setRequiredsAll(tmp);
                        }
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
        getRequired();

        const getOptional = () => {
            FoodService.optional(country, product.restaurant_id, product.variant_id)
                .then((response) => {
                    dispatch(setLoading(false));
                    if (response.status == 200) {
                        setOptionals(response.result);

                        if (response.result.length <= 5) setOptionalsAll(response.result);
                        else {
                            let tmp = [];
                            for (var i = 0; i < 5; i++) {
                                tmp.push(response.result[i]);
                            }
                            setOptionalsAll(tmp);
                        }
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                });
        }
        getOptional();

    }, []);

    useEffect(() => {
        if (isShowRequireds) {
            setRequiredsAll(requireds);
        } else {
            if (requireds.length <= 5) setRequiredsAll(requireds);
            else {
                let tmp = [];
                for (var i = 0; i < 5; i++) {
                    tmp.push(requireds[i]);
                }
                setRequiredsAll(tmp);
            }
        }

        if (isShowOptionals) {
            setOptionalsAll(optionals);
        } else {
            if (optionals.length <= 5) setOptionalsAll(optionals);
            else {
                let tmp = [];
                for (var i = 0; i < 5; i++) {
                    tmp.push(optionals[i]);
                }
                setOptionalsAll(tmp);
            }
        }
    }, [isShowRequireds, isShowOptionals]);

    const onSelect = (type, check, item, count) => {
        if (type == 1) {
            var requiredResult = requiredList.filter((required) => {
                return required.extra_id != item.extra_id
            });
            if (check) {
                setRequiredList([...requiredResult, {
                    extra_id: item.extra_id,
                    extra_name: item.extra_name,
                    extra_minQuantity: count,
                    extra_price: item.extra_price,
                    extra_maxQuantity: item.extra_maxQuantity,
                    allergens_name: item.allergens_name,
                    extra_dash: count
                }]);
            } else {
                setRequiredList(requiredResult);
            }

            console.log(requiredList.length, "  : minRequired = ", minRequired);

        } else {
            var optionalResult = optionalList.filter((optional) => {
                return optional.extra_id != item.extra_id
            });
            if (check) {
                setOptionalList([...optionalResult, {
                    extra_id: item.extra_id,
                    extra_name: item.extra_name,
                    extra_minQuantity: count,
                    extra_price: item.extra_price,
                    extra_maxQuantity: item.extra_maxQuantity,
                    allergens_name: item.allergens_name,
                    extra_dash: count
                }]);
            } else {
                setOptionalList(optionalResult);
            }
        }
    }

    const onAdd = () => {
        if (minRequired == requiredList.length) {

            var extras = [];
            requiredList.map((required, key) => {
                extras.push({
                    id: required.extra_id,
                    quantity: quantity,
                    extraName: required.extra_name,
                    extraPrice: required.extra_price,
                    type: 'require'
                })
            });
            optionalList.map((optional, key) => {
                extras.push({
                    id: optional.extra_id,
                    quantity: quantity,
                    extraName: optional.extra_name,
                    extraPrice: optional.extra_price,
                    type: 'opt'
                })
            });
            console.log(extras);
            var counter = cartProducts.length + 1;
            cartProducts.push({
                cartId: Date.now(),
                variantId: product.variant_id,
                productId: product.product_id,
                productName: product.product_name,
                productDescription: product.product_description,
                allergens: product.allergens_name,
                productPrice: product.product_price,
                boxPrice: isEmpty(product.box_price) ? 0 : product.box_price,
                quantity: quantity,
                message: comment,
                extras,
                counter
            });
            var totalBadge = 0;
            cartProducts.map((cartProduct, key) => {
                totalBadge += cartProduct.quantity;
            });

            console.log("+++++", product);

            dispatch(setCartRestaurant({
                restaurant_id: product.restaurant_id, 
                restaurant_name: product.restaurant_name, 
                restaurant_open: product.restaurant_open,
                restaurant_close: product.restaurant_close,
                restaurant_profileImage: product.restaurant_profileImage,
                restaurant_coverImage: product.restaurant_coverImage,
                card: product.card
            }));
            dispatch(setCartProducts(cartProducts));
            dispatch(setCartBadge(totalBadge));
            // dispatch(setCartBadge(cartBadge + 1));
            dispatch(setCartToast(!cartToast));
            props.navigation.goBack();
        }
    }

    return (
        <SafeAreaView style={styles.saveArea}>
            <Animated.ScrollView contentContainerStyle={styles.content} scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>

                <View style={{ width: wp('100%'), paddingHorizontal: 15, paddingBottom: 15, paddingTop: Platform.OS === 'ios' ? 0 : 10, marginTop: Platform.OS === 'ios' ? -15 : 0 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{product.product_name}</Text>
                    <Text style={{ marginTop: 10, fontSize: 14 }}>{product.product_description}</Text>
                    {!isEmpty(product.allergens_name) ? (
                        <Text style={styles.allergenList}>({i18n.translate('Allergens')}: {product.allergens_name.map((allergen, key) => (
                            <Text key={key} style={styles.allergen}>{allergen.allergen_name}{key != product.allergens_name.length - 1 ? ', ' : ''}</Text>
                        ))})</Text>
                    ) : null}
                    {!isEmpty(requiredsAll) && (
                        <Text style={{ marginTop: 30, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Required extras (')}{minRequired} {i18n.translate('is required)')}</Text>
                    )}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={requiredsAll}
                        keyExtractor={(required, index) => index.toString()}
                        renderItem={(required, index) => (
                            <Required
                                required={required.item}
                                index={index}
                                requiredList={requiredList}
                                quantity={quantity}
                                onSelect={(check, required, count) => onSelect(1, check, required, count)}
                            />
                        )}
                    />
                    {!isEmpty(requiredsAll) && (requireds.length > 5) && (!isShowRequireds ? (
                        <TouchableOpacity style={styles.showHideExtras} onPress={() => setIsShowRequireds(true)}>
                            <Text style={styles.showHideExtrasText}>{i18n.translate('SHOW MORE')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.showHideExtras} onPress={() => setIsShowRequireds(false)}>
                            <Text style={styles.showHideExtrasText}>{i18n.translate('HIDE')}</Text>
                        </TouchableOpacity>
                    ))}

                    {!isEmpty(optionalsAll) && (
                        <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>{i18n.translate('Optional extras (Not required)')}</Text>
                    )}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={optionalsAll}
                        keyExtractor={(optional, index) => index.toString()}
                        renderItem={(optional, index) => (
                            <Optional
                                optional={optional.item}
                                index={index}
                                optionalList={optionalList}
                                quantity={quantity}
                                onSelect={(check, optional, count) => onSelect(2, check, optional, count)}
                            />
                        )}
                    />
                    {!isEmpty(optionalsAll) && (optionals.length > 5) && (!isShowOptionals ? (
                        <TouchableOpacity style={styles.showHideExtras} onPress={() => setIsShowOptionals(true)}>
                            <Text style={styles.showHideExtrasText}>{i18n.translate('SHOW MORE')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.showHideExtras} onPress={() => setIsShowOptionals(false)}>
                            <Text style={styles.showHideExtrasText}>{i18n.translate('HIDE')}</Text>
                        </TouchableOpacity>
                    ))}

                    <Card key='review' style={styles.card}>
                        <View style={[common.flexRow, { marginTop: 10 }]}>
                            <Text style={styles.labelText}>{i18n.translate('Special requests')}</Text>
                        </View>
                        <View style={[common.flexRow, { marginTop: 2 }]}>
                            <Text style={styles.labelDesText}>({i18n.translate('Tell me if you have any allergies or if we need to omit any ingredients')})</Text>
                        </View>
                        <TextField
                            keyboardType='default'
                            returnKeyType='next'
                            fontSize={16}
                            autoCorrect={false}
                            enablesReturnKeyAutomatically={true}
                            value={comment}
                            multiline={true}
                            height={85}
                            lineWidth={0}
                            activeLineWidth={0}
                            containerStyle={[styles.textContainer, common.borderColorGrey]}
                            inputContainerStyle={styles.inputContainer}
                            onChangeText={(value) => setComment(value)}
                        />
                    </Card>
                    <View style={{ height: 150 }}></View>
                </View>
            </Animated.ScrollView>
            <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                <Animated.Image style={[styles.headerBackground, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: RES_URL + product.product_imageUrl }} />
            </Animated.View>
            <Animated.View style={[styles.headerTop, { transform: [{ translateY: headerTopTranslateY }] }]}>
                <Header style={styles.headerContent}>
                    <View style={common.headerLeft}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Icon type='ionicon' name='ios-close' size={30} color={colors.YELLOW.PRIMARY} />
                        </TouchableOpacity>
                    </View>
                </Header>
            </Animated.View>

            <View style={styles.productCart}>
                <View style={styles.cart}>
                    <TouchableOpacity
                        style={styles.countButton1}
                        disabled={quantity == 1}
                        onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                        <Icon
                            type="material-community"
                            name="minus"
                            color={colors.WHITE}
                            size={25}
                        />
                    </TouchableOpacity>
                    <View style={styles.count}>
                        <Text style={styles.countText}>{quantity} db</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.countButton2}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Icon
                            type="material-community"
                            name="plus"
                            color={colors.WHITE}
                            size={25}
                        />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity
                    disabled={minRequired != requiredList.length}
                    style={[styles.button, { backgroundColor: minRequired != requiredList.length ? '#AAA' : '#F78F1E' }]}
                    onPress={() => onAdd()}
                >
                    <Text style={styles.buttonText}>{i18n.translate('Add to the cart')}</Text>
                </TouchableOpacity>
            </View>
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
    content: {
        paddingTop: HEADER_MAX_HEIGHT
    },
    allergenList: {
        marginTop: 12,
        width: '100%',
        fontSize: 16,
        color: '#999'
    },
    allergen: {
        marginTop: 12,
        fontSize: 16,
        color: '#999'
    },
    items: {
        width: wp('100%') - 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },

    check: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '65%'
    },
    item: {
        width: wp('100%') - 70,
    },
    productCart: {
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
        position: 'absolute',
        bottom: 0,
        paddingBottom: BOTTOM_BUTTON_DISTANCE,
        paddingTop: 14,
        paddingHorizontal: '5%',
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 4, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY,
        width: '35%',
        textAlign: 'right'
    },
    cart: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    count: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 30,
    },
    countText: {
        fontWeight: '700',
        fontSize: 15
    },
    countButton1: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: '#F78F1E',
        borderColor: colors.WHITE
    },
    countButton2: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: '#F78F1E',
        borderColor: colors.WHITE
    },
    card: {
        width: '100%',
        // padding: 10,
    },
    labelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.BLACK
    },
    labelDesText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.BLACK
    },
    textContainer: {
        width: '100%',
        marginTop: 10,
        height: 120,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 20,
        marginBottom: 100
    },
    inputContainer: {
        marginTop: -20,
        borderWidth: 0,
        overflow: "scroll"
    },
    button: {
        width: '60%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.WHITE
    },
    showHideExtras: {
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: "#C4C4C4",
        marginHorizontal: -20
    },
    showHideExtrasText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.YELLOW.PRIMARY,
        padding: 8
    }
});