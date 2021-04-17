import React, { useState, useEffect, useRef, Fragment } from "react";
import { CommonActions } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Container, Header, Content } from "native-base";
import { SearchBar } from 'react-native-elements';
import {
  Platform,
  StatusBar,
  BackHandler,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  LogBox,
  Linking
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Icon } from "react-native-elements";
import { setLoading } from "@modules/reducers/auth/actions";
import {
  setCartRestaurant,
  setCartProducts,
  setCartBadge,
} from "@modules/reducers/food/actions";
import { ProfileService, FoodService, AuthService } from "@modules/services";
import { isEmpty, validateBetween, validateName, validateMobile, validateEmail } from "@utils/functions";
import { common, colors } from "@constants/themes";
import { RES_URL } from "@constants/configs";
import FastImage from "react-native-fast-image";
import {
  BackWhiteIcon,
  TrustIcon,
  SuccessIcon,
  MapPinIcon,
  WarningIcon,
  CheckIcon,
  SearchIcon,
  ErrorIcon
} from "@constants/svgs";
import i18n from "@utils/i18n";

import moment from "moment";
import { TextField } from "react-native-material-textfield";
import { ActivityIndicator } from "react-native-paper";

const CartItem = ({
  cartRestaurant,
  cartProduct,
  index,
  onSelect,
  onDelete,
}) => {
  // const [count, setCount] = useState(cartProduct.quantity);
  const cartFinalPrice = () => {
    let final = cartProduct.productPrice;

    cartProduct.extras.map((extra) => {
      final += extra.extraPrice;
    })

    if(!isEmpty(cartProduct.boxPrice) && cartProduct.boxPrice != 0) {
      final += cartProduct.boxPrice;
    }

    final = final * cartProduct.quantity;

    return final;
  }

  return (
    <View key={`cart${index}`} style={styles.cart}>
      <View style={styles.cartMain}>
        <Text style={styles.cartText}>
          {cartProduct.quantity}*{cartProduct.productName} - {(cartProduct.productPrice * cartProduct.quantity).toFixed(2)}{" "}
          {i18n.translate("lei")}
        </Text>
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => onDelete(false, cartProduct, cartProduct.quantity)}
        >
          <TrustIcon />
        </TouchableOpacity>
      </View>
      <Text style={styles.allergen}>{cartProduct.productDescription}</Text>
      {!isEmpty(cartProduct.allergens) ? (
        <Text style={styles.allergenList}>
          ({i18n.translate("Allergens")}:{" "}
          {cartProduct.allergens.map((allergen, key) => (
            <Text key={`allergen${key}`} style={styles.allergen}>
              {allergen.allergen_name}
              {key != cartProduct.allergens.length - 1 ? ", " : ""}
            </Text>
          ))}
          )
        </Text>
      ) : null}
      {!isEmpty(cartProduct.extras)
        ? // <Text style={styles.extraList}>+{cartProduct.extras.map((extra, key) => (
        //     <Text key={`extra${key}`} style={styles.extra}>{extra.quantity}*{extra.extraName}{key != cartProduct.extras.length - 1 ? ', ' : ''}</Text>
        // ))}</Text>
        cartProduct.extras.map((extra, key) => (
          <Text style={styles.extraList} key={`extra${key}`}>
            +
            <Text style={styles.extra}>
              {extra.quantity}*{extra.extraName} :{" "}
              {extra.quantity * extra.extraPrice} {i18n.translate("lei")}
            </Text>
          </Text>
        ))
        : null}
      <View style={styles.cartBottom}>
        <View style={styles.cartLeft}>
          {!isEmpty(cartProduct.boxPrice) && cartProduct.boxPrice != 0 && (
            <Text style={styles.boxPrice}>
              {i18n.translate("Box price")}:{" "}
              {(cartProduct.boxPrice * cartProduct.quantity).toFixed(2)}
              {i18n.translate("lei")}
            </Text>
          )}
          <Text style={styles.price}>
            {cartFinalPrice().toFixed(2)}{" "}
            {i18n.translate("lei")}
          </Text>

        </View>
        <View style={styles.cartButton}>
          <TouchableOpacity
            style={styles.countButton1}
            disabled={cartProduct.quantity == 1}
            onPress={() =>
              cartProduct.quantity > 1 &&
              onSelect(true, cartProduct, cartProduct.quantity - 1, "-")
            }
          >
            <Icon
              type="material-community"
              name="minus"
              color="#333"
              size={25}
            />
          </TouchableOpacity>
          <View style={styles.count}>
            <Text style={{ color: "#333" }}>{cartProduct.quantity} db</Text>
          </View>
          <TouchableOpacity
            style={styles.countButton2}
            onPress={() =>
              onSelect(true, cartProduct, cartProduct.quantity + 1, "+")
            }
          >
            <Icon
              type="material-community"
              name="plus"
              color="#333"
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      {!isEmpty(cartProduct.message) ? (
        <Fragment>
          <Text style={styles.comment}>{i18n.translate("Comment")}:</Text>
          <Text style={styles.commentText}>{cartProduct.message}</Text>
        </Fragment>
      ) : null}
    </View>
  );
};

const UpSellProductItem = ({
  upSellProduct,
  index,
  onSelectUpSellProduct,
}) => {
  const [loader, setLoader] = useState(true);

  return (
    <Card key={`product${index}`} style={styles.product}>
      <View style={styles.productItemGroup}>
        <FastImage
          style={styles.productImage}
          source={{ uri: RES_URL + upSellProduct.product_imageUrl }}
          resizeMode="cover"
          onLoadEnd={(e) => setLoader(false)}
        />
        <View style={styles.productItem} >
          <View style={styles.productItemText}>
            <Text style={styles.productTitle}>
              {upSellProduct.product_name}
            </Text>
            <Text style={styles.productDescription} numberOfLines={1}>
              {upSellProduct.product_description}
            </Text>
          </View>
          <View style={styles.productItemBottom}>
            <Text style={styles.productPrice}>
              {upSellProduct.product_price.toFixed(2)} {i18n.translate("lei")}
            </Text>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => onSelectUpSellProduct(upSellProduct)}
            >
              <Icon
                type="material-community"
                name="plus"
                color={colors.WHITE}
                size={22}
              />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Card>
  );
};


const HEADER_MAX_HEIGHT = Platform.OS === "ios" ? 300 : 260;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 110 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const BOTTOM_BUTTON_DISTANCE = Platform.OS === 'ios' ? 40 : 26;

export default CartDetail = (props) => {
  const dispatch = useDispatch();
  const { logged, country, city, user } = useSelector((state) => state.auth);
  const { cartRestaurant, cartProducts, cartBadge } = useSelector(
    (state) => state.food
  );

  const [success, setSuccess] = useState(false);
  const [restaurant] = useState(cartRestaurant);
  const [visible, setVisible] = useState(false);
  const [checkTemp, setCheckTemp] = useState(false);
  const [itemTemp, setItemTemp] = useState(null);
  const [countTemp, setCountTemp] = useState(0);
  const [total, setTotal] = useState(0);

  const [deliveryList, setDeliveryList] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    value: 0,
    label: "",
  });
  const [take, setTake] = useState(false);
  const [cutlery, setCutlery] = useState(false);
  const [comment, setComment] = useState("");
  const [visitCommentText, setVisitCommentText] = useState(false);
  const [errorCommentText, setErrorCommentText] = useState("");

  const [payment, setPayment] = useState(1);

  const [errorPhone, setErrorPhone] = useState('');
  const [errorName, setErrorName] = useState('');
  const [visitName, setVisitName] = useState(false);
  const [visitPhone, setVisitPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [visitEmail, setVisitEmail] = useState(false);
  const [addressId] = useState(0);
  const [errorCity, setErrorCity] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [visitStreet, setVisitStreet] = useState(false);
  const [errorStreet, setErrorStreet] = useState("");
  const [addressHouseNumber, setAddressHouseNumber] = useState("");
  const [visitHouseNumber, setVisitHouseNumber] = useState(false);
  const [errorHouseNumber, setErrorHouseNumber] = useState("");
  const [addressFloor, setAddressFloor] = useState("");
  const [addressDoorNumber, setAddressDoorNumber] = useState("");
  const [couponCode, setCouponCode] = useState('');
  const [visitCouponCode, setVisitCouponCode] = useState(false);
  const [errorCouponCode, setErrorCouponCode] = useState('');
  const [successCouponCode, setSuccessCouponCode] = useState('');
  const [couponActive, setCouponActive] = useState(0);
  const [couponType, setCouponType] = useState(1);
  const [couponValue, setCouponValue] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const [active, setActive] = useState(false);
  const [filterCitys, setFilterCitys] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [citys, setCitys] = useState([]);
  const [cityObj, setCityObj] = useState({
    id: user.city.id,
    cities: user.city.name,
  });
  const [disabled, setDisabled] = useState(false);
  const [navi, setNavi] = useState(true);
  const [orderId, setOrderId] = useState(0);

  const [visibleNotiPlus, setVisibleNotiPlus] = useState(0);
  const [visibleNotiMinus, setVisibleNotiMinus] = useState(0);
  const [isExtra, setIsExtra] = useState(0);

  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(0);
  const [minimumOrderPrice, setMinimumOrderPrice] = useState(0);
  const [isDelivery, setIsDelivery] = useState(0);

  const [termOfService, setTermOfService] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const [upSellProducts, setUpSellProducts] = useState([]);
  const [upSellActive, setUpSellActive] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });
  const headerBottomTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, HEADER_MAX_HEIGHT],
    extrapolate: "clamp",
  });
  const headerTopTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 0],
    extrapolate: "clamp",
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_SCROLL_DISTANCE / 2 - 30, 5],
    extrapolate: "clamp",
  });

  const getDeliveryAddress = () => {
    dispatch(setLoading(true));
    console.log("country = ", country);
    ProfileService.getDeliveryList(user.token, country)
      .then((response) => {
        dispatch(setLoading(false));
        if (response.status == 200) {
          setDeliveryList(response.result);
          if (!isEmpty(response.result)) {
            setDeliveryAddress({
              value: response.result[0].id,
              label:
                response.result[0].city +
                ", " +
                response.result[0].street +
                ", " +
                response.result[0].houseNumber,
            });
            getDeliveryPrice(response.result[0].city_id);
          } else {
            getDeliveryPrice(cityObj.id);
          }
        }
      })
      .catch((error) => {
        dispatch(setLoading(false));
        console.log(error.message);
      });
  };

  useEffect(() => {
    visitCommentText && !validateBetween(comment, 0, 200)
      ? setErrorCommentText("The text must be less more than 200 characters")
      : setErrorCommentText("");
  }, [comment, visitCommentText]);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

    const getCities = () => {
      dispatch(setLoading(true));
      AuthService.cities(country)
        .then((response) => {
          dispatch(setLoading(false));
          if (response.status == 200) {
            setCitys(response.locations);
            setFilterCitys(response.locations);
            if (cityObj.id == 0) {
              setCityObj(response.locations[0]);
            }
          }
        })
        .catch((error) => {
          dispatch(setLoading(false));
        });
    };
    getCities();

    logged && getDeliveryAddress();

    return () => console.log("Unmounted");
  }, []);

  useEffect(() => {
    (visitStreet && isEmpty(addressStreet)) ||
      (visitStreet && !validateBetween(addressStreet, 2, 100))
      ? setErrorStreet(i18n.translate("The text length must be between 2 ~ 100 characters"))
      : setErrorStreet("");
    (visitHouseNumber && isEmpty(addressHouseNumber)) ||
      (visitHouseNumber && !validateBetween(addressHouseNumber, 1, 20))
      ? setErrorHouseNumber(i18n.translate("The text must be less more than 20 characters"))
      : setErrorHouseNumber("");
    (visitName && isEmpty(userName)) || (visitName && !validateName(userName)) ? setErrorName(i18n.translate('The name must be at least 3 characters long')) : setErrorName('');
    (visitPhone && isEmpty(phone)) || (visitPhone && !validateMobile(phone)) ? setErrorPhone(i18n.translate('Mobile is not valid')) : setErrorPhone('');
    (visitEmail && isEmpty(email)) || (visitEmail && !validateEmail(email)) ? setErrorEmail(i18n.translate('Email is not valid')) : setErrorEmail('');
  }, [addressStreet, visitStreet, addressHouseNumber, visitHouseNumber, visitPhone, phone, visitName, userName, visitEmail, email]);

  useEffect(() => {
    if (success) {
      const handleBackButton = () => {
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    }
  }, [success]);

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
    // if (totalAmount < cartRestaurant.minimumOrderUser && navi) {
    if (totalAmount < minimumOrderPrice && navi) {
      console.log("total amount minimum");
      // setNavi(false);
      // props.navigation.pop();
    }
    if (isEmpty(cartProducts) && navi) {
      console.log("empty cartproducts");
      setTimeout(() => {
        props.navigation.goBack(null);
      }, 50);

    }
  });

  useEffect(() => {
    if (logged) !isEmpty(citys) && getDeliveryAddress();
    else {
      !isEmpty(citys) && getDeliveryPrice((cityObj.id == 0) ? citys[0].id : cityObj.id);
    }
  }, [citys, cityObj]);

  const onDelete = (check, item, count) => {
    setCheckTemp(check);
    setItemTemp(item);
    setCountTemp(count);
    setVisible(true);
  };

  const onSelect = (check, item, count, visibleNotiStatus) => {
    if (check) {
      var index = cartProducts.findIndex((cartProduct) => {
        return cartProduct.cartId == item.cartId;
      });
      cartProducts[index].quantity = count;
      for (var i = 0; i < cartProducts[index].extras.length; i++) {
        cartProducts[index].extras[i].quantity = count;
      }

      var totalBadge = 0;
      cartProducts.map((cartProduct, key) => {
        totalBadge += cartProduct.quantity;
      });
      dispatch(setCartProducts(cartProducts));
      dispatch(setCartBadge(totalBadge));

      if (cartProducts[index].extras.length != 0) setIsExtra(1);
      else setIsExtra(0);

      if (visibleNotiStatus == "+") {
        setVisibleNotiPlus(1);
        setTimeout(() => setVisibleNotiPlus(0), 5000);
      } else if (visibleNotiStatus == "-") {
        setVisibleNotiMinus(1);
        setTimeout(() => setVisibleNotiMinus(0), 5000);
      }
    } else {
      var result = cartProducts.filter((cartProduct) => {
        return cartProduct.cartId != item.cartId;
      });
      var totalBadge = 0;
      result.map((cartProduct, key) => {
        totalBadge += cartProduct.quantity;
      });
      dispatch(setCartProducts(result));
      dispatch(setCartBadge(totalBadge));
      // dispatch(setCartBadge(cartBadge - 1));
      // if (totalBadge <= 0) props.navigation.pop();
    }
    setVisible(false);
  };

  const onOrder = () => {
    dispatch(setLoading(true));
    setDisabled(true);
    setTimeout(() => setDisabled(false), 1000);
    if (!logged || isEmpty(deliveryList)) {
      if (
        cityObj.id == 0 ||
        isEmpty(addressStreet) ||
        isEmpty(addressHouseNumber) ||
        errorStreet ||
        errorHouseNumber
      ) {
        alert("Please enter required field");
      } else {
        dispatch(setLoading(true));

        FoodService.orderWithDeliveryAddress(
          user.token,
          cityObj,
          addressStreet,
          addressHouseNumber,
          addressFloor,
          addressDoorNumber,
          cartRestaurant.restaurant_id,
          take,
          cutlery,
          cartProducts,
          comment,
          (total > freeDelivery ? 0 : deliveryPrice),
          phone,
          userName,
          email,
          country,
          payment
        )
          .then((response) => {
            dispatch(setLoading(false));
            if (response.status == 200) {
              setNavi(false);
              setSuccess(true);
              setOrderId(response.finalOrderId);
              // dispatch(setCartRestaurant(null));
              dispatch(setCartBadge(0));
              dispatch(setCartProducts([]));
            }
          })
          .catch((error) => {
            dispatch(setLoading(false));
          });
      }
    } else {
      FoodService.order(
        user.token,
        user.city,
        deliveryAddress.value,
        cartRestaurant.restaurant_id,
        take,
        cutlery,
        cartProducts,
        comment,
        (total > freeDelivery ? 0 : deliveryPrice),
        country,
        payment
      )
        .then((response) => {
          dispatch(setLoading(false));
          if (response.status == 200) {
            setNavi(false);
            setSuccess(true);
            setOrderId(response.finalOrderId);
            // dispatch(setCartRestaurant(null));
            dispatch(setCartBadge(0));
            dispatch(setCartProducts([]));
          }
        })
        .catch((error) => {
          dispatch(setLoading(false));
        });
    }
  };

  const goOrder = () => {
    dispatch(setLoading(true));
    if (logged) {
      FoodService.getOrder(user.token, country, orderId)
        .then((response) => {
          dispatch(setLoading(false));
          if (response.status == 200) {
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              })
            );
            props.navigation.navigate("Order", {
              screen: "OrderIndex",
              params: { order: response },
            });
          }
        })
        .catch((error) => {
          dispatch(setLoading(false));
          console.log(error.message);
        });
    } else {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    }
  };

  const getDeliveryPrice = (city_id) => {
    console.log(city_id, "  : ==========  ", cartRestaurant.restaurant_id);
    citys.map((city) => {
      if (city.id == city_id) {
        // if (city.locationType == 0) {
        //   setDeliveryPrice(
        //     cartRestaurant.delivery_price_city
        //       ? cartRestaurant.delivery_price_city
        //       : 0
        //   );
        // } else if (city.locationType == 1) {
        //   setDeliveryPrice(
        //     cartRestaurant.delivery_price_village
        //       ? cartRestaurant.delivery_price_village
        //       : 0
        //   );
        // }
        dispatch(setLoading(true));
        ProfileService.getDeliveryPrice(user.token, city_id, cartRestaurant.restaurant_id)
          .then((response) => {
            dispatch(setLoading(false));
            console.log("******  city id", city_id, " : restaurant id = ", cartRestaurant.restaurant_id, " : delivery price ==== ", response);
            if (response.status == 200) {
              if (response.result.length > 0) {
                let free_delivery = (response.result[0].free_delivery == null ? 0 : response.result[0].free_delivery);
                setFreeDelivery(free_delivery);
                setDeliveryPrice(response.result[0].delivery_price);
                setMinimumOrderPrice(response.result[0].minimum_order);
                setIsDelivery(response.result[0].delivery);
              }
              else {
                setIsDelivery(0);
              }
            }
          })
          .catch((error) => {
            dispatch(setLoading(false));
            console.log(error.message);
          });
      }
    });
  };

  useEffect(() => {
    let delivery_price = (total > freeDelivery ? 0 : deliveryPrice);
    let final_price = total + delivery_price;

    if (couponType == 1)  //fixed
    {
      final_price = ((final_price < couponValue) ? 0 : final_price - couponValue);
    }
    else if (couponType == 2) //percentage
    {
      let reducePrice = (final_price * couponValue / 100).toFixed(2);
      final_price = final_price - reducePrice;
    }

    setFinalPrice(final_price);
  }, [total, deliveryPrice, couponType, couponValue])

  const setCouponCodeHandle = () => {
    dispatch(setLoading(true));

    FoodService.setCouponCodeHandle(
      user.token,
      cartRestaurant.restaurant_id,
      couponCode
    )
      .then((response) => {
        dispatch(setLoading(false));
        console.log(response);
        if (response.status == 200) {
          if (response.result[0].active == 0 || response.result[0].active == 2 || response.result[0].active == 3) {
            // setErrorCouponCode(response.msg);
            setErrorCouponCode(i18n.translate('Invalid coupon code'));
            setTimeout(() => { setErrorCouponCode('') }, 5000);

            setCouponActive(0);
          } else if (response.result[0].active == 1) {
            // setSuccessCouponCode(response.msg);
            setSuccessCouponCode(i18n.translate('Coupon code used successfully'));
            setTimeout(() => { setSuccessCouponCode('') }, 5000);

            setCouponActive(1);
            setCouponType(response.result[0].type);
            setCouponValue(response.result[0].value);
          }
        }
        else if (response.status == 404) {
          // setErrorCouponCode(response.msg);
          setErrorCouponCode(i18n.translate('Invalid coupon code'));
          setTimeout(() => { setErrorCouponCode('') }, 5000);

          setCouponActive(0);
        }
      })
      .catch((error) => {
        dispatch(setLoading(false));
        console.log(error);
      });
  }

  const searchFilterFunction = (text) => {
    setFilterText(text);

    const newCitys = citys.filter(item => {
      const itemData = item.cities.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const textData = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      return itemData.indexOf(textData) > -1;
    });

    setFilterCitys(newCitys);
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          // height: 50,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <TextField
          keyboardType='default'
          placeholder={i18n.translate('Search for a place')}
          placeholderTextColor="#666"
          returnKeyType='done'
          fontSize={16}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          value={filterText}
          containerStyle={styles.textContainer2}
          inputContainerStyle={styles.inputContainer2}
          lineWidth={0}
          activeLineWidth={0}
          renderLeftAccessory={() => {
            return <SearchIcon style={{ marginRight: 10 }} />;
          }}
          onChangeText={(value) => {
            searchFilterFunction(value);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    dispatch(setLoading(true));
    FoodService.getUpSellProducts(cartRestaurant.restaurant_id, country)
      .then((response) => {
        dispatch(setLoading(false));
        if (response.status == 200) {
          setUpSellProducts(response.result);
        }
        else {
          setUpSellProducts([]);
        }
      })
      .catch(error => {
        dispatch(setLoading(false));
        setUpSellProducts([]);
      })

    // FoodService.products( "en", 1, 1, 1, 1, "")
    //   .then(async (response) => {
    //     dispatch(setLoading(false));
    //     if (response.status == 200) {
    //       setUpSellProducts(response.result);
    //     } else {
    //       setUpSellProducts([]);
    //     }
    //   })
    //   .catch((error) => {
    //     dispatch(setLoading(false));
    //     setUpSellProducts([]);
    //   });
  }, []);

  const onSelectUpSellProduct = (item) => {
    console.log(item);
    // if (item.modal == 0) // add cart
    // {
    //   var counter = cartProducts.length + 1;
    //   cartProducts.push({
    //     cartId: Date.now(),
    //     variantId: item.variant_id,
    //     productId: item.product_id,
    //     productName: item.product_name,
    //     productDescription: item.product_description,
    //     allergens: item.allergens_name,
    //     productPrice: item.product_price,
    //     boxPrice: isEmpty(item.box_price) ? 0 : item.box_price,
    //     quantity: 1,
    //     message: '',
    //     extras: [],
    //     counter
    //   });
    //   var totalBadge = 0;
    //   cartProducts.map((cartProduct, key) => {
    //     totalBadge += cartProduct.quantity;
    //   });

    //   dispatch(setCartProducts(cartProducts));
    //   dispatch(setCartBadge(totalBadge));
    //   // dispatch(setCartToast(!cartToast));
    // }
    // else if (item.modal == 1) //go to extra
    // {
    props.navigation.push('CartExtra', { restaurant: cartRestaurant, product: item, count: 1 })
    // }
  }

  return (
    <SafeAreaView style={styles.saveArea}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        scrollEnabled={active ? false : upSellActive? false : true}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {!success ? (
          <TouchableOpacity style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }} activeOpacity={1} onPress={() => {setActive(false); setUpSellActive(false);}}>
            <Text
              style={[styles.cartText, { marginTop: 10 }]}
              numberOfLines={1}
            >
              {i18n.translate("Order complete")}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cartProducts}
              keyExtractor={(cartProduct, index) => index.toString()}
              renderItem={(cartProduct, index) => (
                <CartItem
                  cartRestaurant={cartRestaurant}
                  cartProduct={cartProduct.item}
                  onSelect={(check, item, count, visibleNotiStatus) =>
                    onSelect(check, item, count, visibleNotiStatus)
                  }
                  onDelete={(check, item, count) =>
                    onDelete(check, item, count)
                  }
                />
              )}
            />
            {!isEmpty(upSellProducts) && (
              <TouchableOpacity opPress={() => setUpSellActive(true)}>
                <Text style={styles.upsellproduct_title}>{i18n.translate('Popular choices for your order')}</Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={upSellProducts}
                  keyExtractor={(upSellProduct, index) => index.toString()}
                  renderItem={(upSellProduct, index) => (
                    <UpSellProductItem
                      upSellProduct={upSellProduct.item}
                      onSelectUpSellProduct={(item) =>
                        onSelectUpSellProduct(item)
                      }
                    />
                  )}
                />
              </TouchableOpacity>
            )}
            <View style={styles.amount}>
              <Text style={styles.priceGrey}>
                {i18n.translate("Total")}: {total.toFixed(2)}{" "}
                {i18n.translate("lei")}
              </Text>
            </View>
            <View>
              <View style={styles.amount1}>
                <Text style={styles.priceGrey}>
                  {i18n.translate("Delivery")}: {(total > freeDelivery ? 0 : deliveryPrice).toFixed(2)}{" "}
                  {i18n.translate("lei")}
                </Text>
              </View>
              <View style={styles.amount1}>
                <Text style={styles.price}>
                  {i18n.translate("Final")}:{" "}
                  <Text style={couponActive == 1 ? styles.couponPrice : styles.price}>
                    {(total + (total > freeDelivery ? 0 : deliveryPrice)).toFixed(2)} {i18n.translate("lei")}
                  </Text>
                  {(couponActive == 1) && (
                    <Text style={styles.price}>
                      {"  "}{finalPrice.toFixed(2)} {i18n.translate("lei")}
                    </Text>
                  )}
                </Text>
              </View>
            </View>

            {(minimumOrderPrice > finalPrice) && (
              <View style={styles.notDeliveryBack}>
                <ErrorIcon />
                <Text style={styles.notDelivery}>
                  {i18n.translate('Restaurant minimum order')}{': '}{minimumOrderPrice}{" "}{i18n.translate("lei")}
                </Text>
              </View>
            )}

            {!logged && (
              <View style={styles.PhoneAndName}>
                <View style={common.flexRow}>
                  <Text
                    style={[
                      styles.labelText1,
                      !isEmpty(errorEmail)
                        ? common.fontColorRed
                        : common.fontColorBlack,
                    ]}
                  >
                    {i18n.translate("E-mail")}
                  </Text>
                  <Text
                    style={[
                      styles.labelTextNormal1,
                      !isEmpty(errorEmail)
                        ? common.fontColorRed
                        : common.fontColorBlack,
                    ]}
                  >
                    {" "}
                    ({i18n.translate("Required")})
                  </Text>
                </View>
                <TextField
                  keyboardType="default"
                  returnKeyType="next"
                  fontSize={16}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  value={email}
                  containerStyle={[
                    styles.textContainer1,
                    !isEmpty(errorEmail)
                      ? common.borderColorRed
                      : common.borderColorGrey,
                  ]}
                  inputContainerStyle={styles.inputContainer1}
                  lineWidth={0}
                  activeLineWidth={0}
                  onChangeText={(value) => {
                    setEmail(value);
                    setVisitEmail(true);
                  }}
                />
                <Text style={common.errorText}>{errorEmail}</Text>
              </View>
            )}
            {!logged && (
              <View style={styles.PhoneAndName}>
                <View style={common.flexRow}>
                  <Text
                    style={[
                      styles.labelText1,
                      !isEmpty(errorPhone)
                        ? common.fontColorRed
                        : common.fontColorBlack,
                    ]}
                  >
                    {i18n.translate("Phone number")}
                  </Text>
                  <Text
                    style={[
                      styles.labelTextNormal1,
                      !isEmpty(errorPhone)
                        ? common.fontColorRed
                        : common.fontColorBlack,
                    ]}
                  >
                    {" "}
                    ({i18n.translate("Required")})
                  </Text>
                </View>
                <TextField
                  keyboardType="number-pad"
                  returnKeyType="next"
                  fontSize={16}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  value={phone}
                  containerStyle={[
                    styles.textContainer1,
                    !isEmpty(errorPhone)
                      ? common.borderColorRed
                      : common.borderColorGrey,
                  ]}
                  inputContainerStyle={styles.inputContainer1}
                  lineWidth={0}
                  activeLineWidth={0}
                  ref={(input) => {
                    this.textInput = input;
                  }}
                  onChangeText={(value) => {
                    if (value.length >= 9) {
                      if (value.substr(0, 1) == '0') {
                        setPhone('+4' + value);
                        this.textInput.setValue('+4' + value);
                      }
                      else if (value.substr(0, 2) != '40' && value.substr(0, 3) != '+40' && value.substr(0, 1) != '+') {
                        setPhone('+40' + value);
                        this.textInput.setValue('+40' + value);
                      }
                      else if (value.substr(0, 2) == '40') {
                        setPhone('+' + value);
                        this.textInput.setValue('+' + value);
                      }
                      else
                        setPhone(value);
                    }
                    else
                      setPhone(value);

                    setVisitPhone(true);
                  }}
                />
                <Text style={common.errorText}>{errorPhone}</Text>
              </View>
            )}
            {!logged && (
              <View style={styles.PhoneAndName}>
                <View style={common.flexRow}>
                  <Text
                    style={[
                      styles.labelText1,
                      !isEmpty(errorName)
                        ? common.fontColorRed
                        : common.fontColorBlack,
                    ]}
                  >
                    {i18n.translate("Name")}
                  </Text>
                  <Text
                    style={[
                      styles.labelTextNormal1,
                      !isEmpty(errorName)
                        ? common.fontColorRed
                        : common.fontColorBlack,
                    ]}
                  >
                    {" "}
                    ({i18n.translate("Required")})
                  </Text>
                </View>
                <TextField
                  keyboardType="default"
                  returnKeyType="next"
                  fontSize={16}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  value={userName}
                  containerStyle={[
                    styles.textContainer1,
                    !isEmpty(errorName)
                      ? common.borderColorRed
                      : common.borderColorGrey,
                  ]}
                  inputContainerStyle={styles.inputContainer1}
                  lineWidth={0}
                  activeLineWidth={0}
                  onChangeText={(value) => {
                    setUserName(value);
                    setVisitName(true);
                  }}
                />
                <Text style={common.errorText}>{errorName}</Text>
              </View>
            )}
            <Text style={[styles.cartText, { marginTop: 20 }]}>
              {i18n.translate("Take over")}
            </Text>
            {logged && !isEmpty(deliveryList) ? (
              <View style={{ width: "100%" }}>
                {deliveryList.map((delivery, key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.radioButton}
                    onPress={() => {
                      setDeliveryAddress({
                        value: delivery.id,
                        label:
                          delivery.city +
                          ", " +
                          delivery.street +
                          ", " +
                          delivery.houseNumber +
                          ", " +
                          delivery.floor +
                          ", " +
                          delivery.doorNumber,
                      });
                      getDeliveryPrice(delivery.city_id);
                    }}
                  >
                    <Icon
                      type="material"
                      name={
                        delivery.id == deliveryAddress.value
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      color={
                        delivery.id == deliveryAddress.value
                          ? colors.YELLOW.PRIMARY
                          : colors.BLACK
                      }
                      size={20}
                    />
                    <Text style={styles.radioText}>
                      {delivery.city +
                        ", " +
                        delivery.street +
                        ", " +
                        delivery.houseNumber +
                        ", " +
                        delivery.floor +
                        ", " +
                        delivery.doorNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
                {(isDelivery == 0) && (
                  <View style={styles.notDeliveryBack}>
                    <ErrorIcon />
                    <Text style={styles.notDelivery}>
                      {i18n.translate("Restaurant does not delivery in here")}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.content1}>
                <View style={styles.selectView1}>
                  <View style={common.flexRow}>
                    <Text
                      style={[
                        styles.labelText1,
                        !isEmpty(errorCity)
                          ? common.fontColorRed
                          : common.fontColorBlack,
                      ]}
                    >
                      {i18n.translate("Settlement")}
                    </Text>
                    <Text
                      style={[
                        styles.labelTextNormal1,
                        !isEmpty(errorCity)
                          ? common.fontColorRed
                          : common.fontColorBlack,
                      ]}
                    >
                      {" "}
                      ({i18n.translate("Required")})
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.selectContainer1,
                      !isEmpty(errorCity)
                        ? common.borderColorRed
                        : common.borderColorGrey,
                    ]}
                    onPress={() => setActive(!active)}
                  >
                    <MapPinIcon />
                    <Text style={styles.itemText1} numberOfLines={1}>
                      {cityObj.cities}
                    </Text>
                    <Icon
                      type="material"
                      name="keyboard-arrow-down"
                      size={30}
                      color={colors.GREY.PRIMARY}
                    />
                  </TouchableOpacity>
                  {/* <Text style={common.errorText}>{errorCity}</Text> */}
                </View>
                {active ? (
                  <FlatList
                    style={!isEmpty(filterCitys) && filterCitys.length > 5 ? styles.listView1height : styles.listView1}
                    ListHeaderComponent={renderHeader()}
                    data={filterCitys}
                    keyExtractor={(cityOne, key) => key.toString()}
                    stickyHeaderIndices={[0]}
                    renderItem={(cityOne, key) => (
                      <TouchableOpacity
                        style={[
                          styles.itemView1,
                          key == filterCitys.length - 1 && styles.noborder1,
                        ]}
                        onPress={() => {
                          setActive(false);
                          setCityObj(cityOne.item);
                          getDeliveryPrice(cityOne.item.id);
                        }}
                      >
                        <Text style={styles.itemText1} numberOfLines={1}>
                          {cityOne.item.cities}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Fragment>
                    {(isDelivery == 0) && (
                      <View style={styles.notDeliveryBack}>
                        <ErrorIcon />
                        <Text style={styles.notDelivery}>
                          {i18n.translate("Restaurant does not delivery in here")}
                        </Text>
                      </View>
                    )}
                    <View style={styles.streetView1}>
                      <View style={common.flexRow}>
                        <Text
                          style={[
                            styles.labelText1,
                            !isEmpty(errorStreet)
                              ? common.fontColorRed
                              : common.fontColorBlack,
                          ]}
                        >
                          {i18n.translate("Street")}
                        </Text>
                        <Text
                          style={[
                            styles.labelTextNormal1,
                            !isEmpty(errorStreet)
                              ? common.fontColorRed
                              : common.fontColorBlack,
                          ]}
                        >
                          {" "}
                          ({i18n.translate("Required")})
                        </Text>
                      </View>
                      <TextField
                        keyboardType="default"
                        returnKeyType="next"
                        fontSize={16}
                        autoCorrect={false}
                        enablesReturnKeyAutomatically={true}
                        value={addressStreet}
                        containerStyle={[
                          styles.textContainer1,
                          !isEmpty(errorStreet)
                            ? common.borderColorRed
                            : common.borderColorGrey,
                        ]}
                        inputContainerStyle={styles.inputContainer1}
                        lineWidth={0}
                        activeLineWidth={0}
                        onChangeText={(value) => {
                          setAddressStreet(value);
                          setVisitStreet(true);
                        }}
                      />
                      <Text style={common.errorText}>{errorStreet}</Text>
                    </View>
                    <View style={styles.threeView1}>
                      <View style={styles.inputView1}>
                        <Text
                          style={[
                            styles.labelText1,
                            !isEmpty(errorHouseNumber)
                              ? common.fontColorRed
                              : common.fontColorBlack,
                          ]}
                        >
                          {i18n.translate("House number")}
                        </Text>
                        <Text
                          style={[
                            styles.labelTextNormal1,
                            !isEmpty(errorHouseNumber)
                              ? common.fontColorRed
                              : common.fontColorBlack,
                          ]}
                        >
                          {" "}
                          ({i18n.translate("Required")})
                        </Text>
                        <TextField
                          keyboardType="default"
                          returnKeyType="next"
                          fontSize={16}
                          autoCorrect={false}
                          enablesReturnKeyAutomatically={true}
                          value={addressHouseNumber}
                          containerStyle={[
                            styles.textContainer1,
                            !isEmpty(errorHouseNumber)
                              ? common.borderColorRed
                              : common.borderColorGrey,
                          ]}
                          inputContainerStyle={styles.inputContainer1}
                          lineWidth={0}
                          activeLineWidth={0}
                          onChangeText={(value) => {
                            setAddressHouseNumber(value);
                            setVisitHouseNumber(true);
                          }}
                        />
                        <Text style={common.errorText}>{errorHouseNumber}</Text>
                      </View>
                      <View style={styles.inputView1}>
                        <Text
                          style={[styles.labelText1, common.fontColorBlack]}
                        >
                          {i18n.translate("Floor")}
                        </Text>
                        <Text
                          style={[
                            styles.labelTextNormal1,
                            common.fontColorBlack,
                          ]}
                        >
                          {" "}
                          ({i18n.translate("Optional")})
                        </Text>
                        <TextField
                          keyboardType="default"
                          returnKeyType="next"
                          fontSize={16}
                          autoCorrect={false}
                          enablesReturnKeyAutomatically={true}
                          value={addressFloor}
                          containerStyle={[
                            styles.textContainer1,
                            common.borderColorGrey,
                          ]}
                          inputContainerStyle={styles.inputContainer1}
                          lineWidth={0}
                          activeLineWidth={0}
                          onChangeText={(value) => {
                            setAddressFloor(value);
                          }}
                        />
                      </View>
                      <View style={styles.inputView1}>
                        <Text
                          style={[styles.labelText1, common.fontColorBlack]}
                        >
                          {i18n.translate("Door")}
                        </Text>
                        <Text
                          style={[
                            styles.labelTextNormal1,
                            common.fontColorBlack,
                          ]}
                        >
                          {" "}
                          ({i18n.translate("Optional")})
                        </Text>
                        <TextField
                          keyboardType="default"
                          fontSize={16}
                          autoCorrect={false}
                          enablesReturnKeyAutomatically={true}
                          value={addressDoorNumber}
                          containerStyle={[
                            styles.textContainer1,
                            common.borderColorGrey,
                          ]}
                          inputContainerStyle={styles.inputContainer1}
                          lineWidth={0}
                          activeLineWidth={0}
                          onChangeText={(value) => {
                            setAddressDoorNumber(value);
                          }}
                        />
                      </View>
                    </View>
                  </Fragment>
                )}
              </View>
            )}
            <View style={{ height: 20 }} />
            <View style={styles.PhoneAndName}>
              <View style={common.flexRow}>
                <Text
                  style={[
                    styles.labelText1,
                    !isEmpty(errorCouponCode)
                      ? common.fontColorRed
                      : common.fontColorBlack,
                  ]}
                >
                  {i18n.translate("Coupon Codes")}
                </Text>
                {/* <Text
                  style={[
                    styles.labelTextNormal1,
                    !isEmpty(errorCouponCode)
                      ? common.fontColorRed
                      : common.fontColorBlack,
                  ]}
                >
                  {" "}
                    ({i18n.translate("If exist")})
                </Text> */}
              </View>
              <View style={styles.couponCodeContainer}>
                <TextField
                  keyboardType="default"
                  returnKeyType="next"
                  fontSize={16}
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  value={couponCode}
                  containerStyle={[
                    styles.couponCodeInput,
                    !isEmpty(errorCouponCode)
                      ? common.borderColorRed
                      : common.borderColorGrey,
                  ]}
                  inputContainerStyle={styles.inputContainer1}
                  lineWidth={0}
                  activeLineWidth={0}
                  onChangeText={(value) => {
                    setCouponCode(value);
                    setVisitCouponCode(true);
                    setErrorCouponCode('');
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.couponCodeButton,
                    (errorCouponCode || isEmpty(couponCode))
                      ? common.backColorGrey
                      : common.backColorYellow,
                  ]}
                  disabled={
                    disabled || (errorCouponCode || isEmpty(couponCode))
                  }
                  onPress={() => setCouponCodeHandle()}
                >
                  <Text style={styles.buttonText}>
                    {i18n.translate("Activate")}
                  </Text>
                </TouchableOpacity>
              </View>
              {(errorCouponCode != '') && (
                <View style={styles.errorCouponCodeBack}>
                  <ErrorIcon />
                  <Text style={styles.errorCouponCode}>
                    {errorCouponCode}
                  </Text>
                </View>
              )}
              {(successCouponCode != '') && (
                <View style={styles.successCouponCodeBack}>
                  <CheckIcon />
                  <Text style={styles.successCouponCode}>
                    {successCouponCode}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ height: 20 }} />
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setTake(!take)}
            >
              <Icon
                type="material"
                name={take ? "check-box" : "check-box-outline-blank"}
                color={take ? colors.YELLOW.PRIMARY : colors.BLACK}
                size={20}
              />
              <Text style={styles.radioText} numberOfLines={1}>
                {i18n.translate("Take away")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setCutlery(!cutlery)}
            >
              <Icon
                type="material"
                name={cutlery ? "check-box" : "check-box-outline-blank"}
                color={cutlery ? colors.YELLOW.PRIMARY : colors.BLACK}
                size={20}
              />
              <Text style={styles.radioText} numberOfLines={1}>
                {i18n.translate("Without cutlery")}
              </Text>
            </TouchableOpacity>

            <Card key="review" style={styles.card}>
              <View style={common.flexRow}>
                <Text style={styles.labelText}>
                  {i18n.translate("Comment")}
                </Text>
              </View>
              <TextField
                keyboardType="default"
                returnKeyType="next"
                fontSize={16}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                value={comment}
                multiline={true}
                height={85}
                containerStyle={[
                  styles.textContainer,
                  !isEmpty(errorCommentText)
                    ? common.borderColorRed
                    : common.borderColorGrey,
                ]}
                inputContainerStyle={styles.inputContainer}
                lineWidth={0}
                activeLineWidth={0}
                onChangeText={(value) => {
                  setComment(value);
                  setVisitCommentText(true);
                }}
              />
              <Text style={common.errorText}>{errorCommentText}</Text>
            </Card>
            <Text
              style={[styles.cartText, { marginTop: 20 }]}
              numberOfLines={1}
            >
              {i18n.translate("Payment method")}
            </Text>
            <TouchableOpacity style={styles.radioButton} onPress={() => setPayment(1)}>
              <Icon
                type="material"
                name={
                  payment == 1
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                color={
                  payment == 1
                    ? colors.YELLOW.PRIMARY
                    : colors.BLACK
                }
                size={20}
              />
              <Text style={styles.radioText} numberOfLines={1}>
                {i18n.translate("Cash")}
              </Text>
            </TouchableOpacity>
            {restaurant.card == 1 && (
              <TouchableOpacity style={styles.radioButton} onPress={() => setPayment(2)}>
                <Icon
                  type="material"
                  name={
                    payment == 2
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  color={
                    payment == 2
                      ? colors.YELLOW.PRIMARY
                      : colors.BLACK
                  }
                  size={20}
                />
                <Text style={styles.radioText} numberOfLines={1}>
                  {i18n.translate("Credit card at the courier")}
                </Text>
              </TouchableOpacity>
            )}
            {!logged && (
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
            )}
            {/* {!logged && (
              <TouchableOpacity style={styles.rememberMe} onPress={() => setPrivacy(!privacy)}>
                <Icon
                  type='material-community'
                  name={privacy ? 'check-box-outline' : 'checkbox-blank-outline'}
                  size={25}
                  color={privacy ? colors.YELLOW.PRIMARY : colors.GREY.PRIMARY}
                />
                <Text style={styles.rememberText}>{i18n.translate('I accept the ')}
                  <Text style={[styles.rememberText, common.fontColorYellow, common.underLine]} onPress={() => Linking.openURL('http://foodnet.ro/ro/privacy')}>{i18n.translate('Privacy')}</Text>
                </Text>
              </TouchableOpacity>
            )} */}
            <View style={{ height: 160 }}></View>
          </TouchableOpacity>
        ) : (
          <View style={styles.success}>
            <View style={common.height50} />
            <SuccessIcon />
            <Text style={styles.iconText}>
              {i18n.translate("Congratulation")}
            </Text>
            <Text style={styles.mainText}>
              {i18n.translate("Successful offer")}
            </Text>
            <Text style={styles.mainDescription}>
              {i18n.translate(
                "Your order will arrive soon We wish you a good appetite in advance"
              )}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => goOrder()}
            >
              <Text style={styles.successText}>
                {i18n.translate("Order status")}
              </Text>
            </TouchableOpacity>
            <View style={common.height50} />
          </View>
        )}
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Animated.View style={[styles.headerBackgroundGrey, { transform: [{ translateY: imageTranslateY }] }]} />
        <Animated.Image
          style={[
            styles.headerBackground,
            { transform: [{ translateY: imageTranslateY }] },
          ]}
          source={{ uri: RES_URL + restaurant.restaurant_coverImage }}
        />
        <Animated.View
          style={[
            styles.headerBottom,
            { transform: [{ translateY: headerBottomTranslateY }] },
          ]}
        >
          <View style={styles.avatar}>
            <Image
              style={styles.avatarView}
              source={{ uri: RES_URL + restaurant.restaurant_profileImage }}
              resizeMode="contain"
            />
          </View>
          <View>
            <View style={styles.statusView}>
              <View
                style={[
                  styles.statusItem,
                  parseInt(moment().format("HH:mm").replace(":", "")) <=
                    parseInt(restaurant.restaurant_open.replace(":", "")) ||
                    parseInt(moment().format("HH:mm").replace(":", "")) >=
                    parseInt(restaurant.restaurant_close.replace(":", ""))
                    ? styles.statusRed
                    : styles.statusGreen,
                ]}
              >
                <Text style={styles.statusText}>
                  {parseInt(moment().format("HH:mm").replace(":", "")) <=
                    parseInt(restaurant.restaurant_open.replace(":", "")) ||
                    parseInt(moment().format("HH:mm").replace(":", "")) >=
                    parseInt(restaurant.restaurant_close.replace(":", ""))
                    ? i18n.translate("CLOSED")
                    : i18n.translate("OPEN")}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[
          styles.headerTop,
          { transform: [{ translateY: headerTopTranslateY }] },
        ]}
      >
        {isExtra == 1 && (
          <View style={styles.notificationView}>
            {visibleNotiPlus == 1 && (
              <View style={styles.notificationBack}>
                <WarningIcon />
                <Text style={styles.notification}>
                  {i18n.translate("increase items")}
                </Text>
              </View>
            )}
            {visibleNotiMinus == 1 && (
              <View style={styles.notificationBack}>
                <WarningIcon />
                <Text style={styles.notification}>
                  {i18n.translate("decrease items")}
                </Text>
              </View>
            )}
          </View>
        )}

        <Header style={styles.headerContent}>
          <View style={common.headerLeft}>
            {!success && (
              <TouchableOpacity onPress={() => props.navigation.pop()}>
                <BackWhiteIcon />
              </TouchableOpacity>
            )}
          </View>
          <Animated.View
            style={[{ transform: [{ translateY: titleTranslateY }] }]}
          >
            <Text style={styles.headerTitle} numberOfLines={1}>
              {restaurant.restaurant_name}
            </Text>
          </Animated.View>
          <View style={common.headerRight} />
        </Header>
      </Animated.View>
      {!success && (
        <View style={styles.goToOrder}>
          <View style={styles.orderAmount}>
            <Text style={styles.orderPrice}>
              {i18n.translate("Final")}
            </Text>
            <Text style={styles.orderPrice}>
              {(couponActive == 0) ? (total + (total > freeDelivery ? 0 : deliveryPrice)).toFixed(2) : finalPrice.toFixed(2)}{" "}{i18n.translate("lei")}
            </Text>
          </View>
          <View
            style={styles.orderButtonView}
          >
            {logged ? (
              <TouchableOpacity
                style={[
                  styles.orderButton,
                  (isEmpty(deliveryList) &&
                    (cityObj.id == 0 || isEmpty(addressStreet) || isEmpty(addressHouseNumber) || errorStreet || errorHouseNumber)) ||
                    (isDelivery == 0 || finalPrice < minimumOrderPrice) ||
                    !validateBetween(comment, 0, 300)
                    ? common.backColorGrey
                    : common.backColorYellow,
                ]}
                disabled={
                  disabled ||
                  (isEmpty(deliveryList) &&
                    (cityObj.id == 0 || isEmpty(addressStreet) || isEmpty(addressHouseNumber) || errorStreet || errorHouseNumber)) ||
                  (isDelivery == 0 || finalPrice < minimumOrderPrice) ||
                  !validateBetween(comment, 0, 300)
                }
                onPress={() => onOrder()}
              >
                {minimumOrderPrice > finalPrice ? (
                  <Text style={styles.buttonText}>
                    {i18n.translate("More")}{" "}
                    {(minimumOrderPrice - finalPrice).toFixed(2)}{" "}
                    {i18n.translate("lei")}
                  </Text>
                ) : (
                  <Text style={styles.buttonText}>
                    {i18n.translate("Order Now")}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.orderButton,
                  ((isEmpty(deliveryList) &&
                    (cityObj.id == 0 || isEmpty(addressStreet) || isEmpty(addressHouseNumber) || errorStreet || errorHouseNumber)) ||
                    (isDelivery == 0 || finalPrice < minimumOrderPrice) ||
                    !validateBetween(comment, 0, 300)) || (!termOfService || errorPhone || errorName || isEmpty(phone) || isEmpty(userName) || errorEmail || isEmpty(email))
                    ? common.backColorGrey
                    : common.backColorYellow,
                ]}
                disabled={
                  disabled ||
                  ((isEmpty(deliveryList) &&
                    (cityObj.id == 0 || isEmpty(addressStreet) || isEmpty(addressHouseNumber) || errorStreet || errorHouseNumber)) ||
                    (isDelivery == 0 || finalPrice < minimumOrderPrice) ||
                    !validateBetween(comment, 0, 300)) || (!termOfService || errorPhone || errorName || isEmpty(phone) || isEmpty(userName) || errorEmail || isEmpty(email))
                }
                onPress={() => onOrder()}
              >
                {minimumOrderPrice > finalPrice ? (
                  <Text style={styles.buttonText}>
                    {i18n.translate("More")}{" "}
                    {(minimumOrderPrice - finalPrice).toFixed(2)}{" "}
                    {i18n.translate("lei")}
                  </Text>
                ) : (
                  <Text style={styles.buttonText}>
                    {i18n.translate("Order Now")}
                  </Text>
                )}
              </TouchableOpacity>
            )}

          </View>
        </View>
      )}
      {visible && (
        <View style={styles.modalContainer}>
          <View style={styles.overlay} />
          <View style={styles.modalView}>
            <View style={styles.modalMain}>
              <Text style={styles.modalTitle}>
                {i18n.translate(
                  "Are you sure you want to delete the contents of your cart all"
                )}
              </Text>
              <Text style={styles.modalDescription}>
                {/* {i18n.translate("This operation cannot be undone")} */}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onSelect(checkTemp, itemTemp, countTemp, "+")}
            >
              <Text style={styles.saveText}>{i18n.translate("Delete")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>{i18n.translate("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  successCouponCodeBack: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4ACC4F',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: "#4ACC4F22",
    alignItems: 'center'
  },
  successCouponCode: {
    fontSize: 16,
    marginLeft: 3,
    fontWeight: "bold",
    color: '#4ACC4F',
  },
  errorCouponCodeBack: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F05050',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: "#F0505022",
    alignItems: 'center'
  },
  errorCouponCode: {
    fontSize: 16,
    marginLeft: 3,
    fontWeight: "bold",
    color: colors.RED.PRIMARY,
  },
  notDeliveryBack: {
    display: "flex",
    flexDirection: "row",
    marginTop: 25,
    marginBottom: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F05050',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: "#F0505022",
    alignItems: 'center'
  },
  notDelivery: {
    fontSize: 16,
    marginLeft: 3,
    fontWeight: "bold",
    color: colors.RED.PRIMARY,
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
  notificationView: {
    position: "absolute",
    zIndex: 2002,
    top: 5,
    display: "flex",
    flexDirection: "column",
  },
  notificationBack: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: "5%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "90%",
    justifyContent: "flex-start",
    backgroundColor: "#feebd6",
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: Platform.OS === "ios" ? 0.5 : 0.7,
    shadowRadius: 5,
    elevation: 5,
  },
  notification: {
    fontSize: 16,
    marginLeft: 3,
    color: colors.YELLOW.PRIMARY,
  },
  saveArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000080",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
    marginTop: 0,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  headerContent: {
    width: wp("100%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    elevation: 0,
  },
  headerTop: {
    marginTop: Platform.OS === "ios" ? 40 : 0,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerTitle: {
    width: wp("60%"),
    height: 25,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.WHITE,
    textAlign: "center",
  },
  headerBottom: {
    top: HEADER_MAX_HEIGHT - 50,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    width: wp("100%"),
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
    backgroundColor: "#C4C4C4",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarView: {
    height: 90,
    width: 90,
  },
  statusView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: -55,
    marginLeft: 20,
  },
  statusItem: {
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "#FEEBD6",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  statusGreen: {
    backgroundColor: "#4ACC4F",
  },
  statusRed: {
    backgroundColor: "#F05050",
  },
  content: {
    paddingTop: HEADER_MAX_HEIGHT - 32,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FEEBD6",
    backgroundColor: colors.YELLOW.PRIMARY,
    marginTop: -30,
    marginLeft: 15,
  },
  badgeEmpty: {
    justifyContent: "center",
    alignItems: "center",
    width: 16,
    height: 16,
    marginTop: -30,
    marginLeft: 15,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  toast: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    bottom: 0,
    paddingLeft: 50,
    width: wp("100%"),
    height: 60,
    backgroundColor: "#FEEBD6",
    shadowColor: colors.BLACK,
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  toastText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#F78F1E",
  },
  mainContainer: {
    width: wp("100%"),
    padding: 10,
  },

  amount: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 10,
  },
  amount1: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  priceGrey: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.GREY.PRIMARY,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.YELLOW.PRIMARY,
  },
  couponPrice: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: colors.YELLOW.PRIMARY,
  },
  subscription: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#6D6D6D",
  },
  goToOrder: {
    width: wp('100%'),
    position: 'absolute',
    bottom: 0,
    paddingBottom: BOTTOM_BUTTON_DISTANCE,
    paddingTop: 9,
    paddingHorizontal: '5%',
    backgroundColor: colors.WHITE,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  orderAmount: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 9,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: '700'
  },
  orderButtonView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  orderButton: {
    width: "100%",
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: '#F78F1E',
  },
  button: {
    marginBottom: 20,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    // backgroundColor: colors.YELLOW.PRIMARY
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  emptyView: {
    width: "100%",
    alignItems: "center",
    marginTop: 100,
    padding: 20,
  },
  emptyText1: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.YELLOW.PRIMARY,
  },
  emptyText2: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  cart: {
    width: "100%",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
  },
  cartMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // height: 30,
    marginTop: 15,
    marginBottom: 10,
  },
  cartText: {
    width: "70%",
    fontSize: 16,
    lineHeight: 24,
    color: "#111",
    fontWeight: "bold",
  },
  allergenList: {
    marginTop: 5,
    width: "100%",
    fontSize: 16,
    color: "#999",
  },
  allergen: {
    fontSize: 16,
    color: "#999",
  },
  extraList: {
    marginTop: 10,
    width: "100%",
    fontSize: 16,
    color: colors.BLACK,
  },
  extra: {
    fontSize: 16,
    color: colors.BLACK,
  },
  cartBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  cartLeft: {
    alignItems: "flex-start",
  },
  boxPrice: {
    fontSize: 14,
    color: "#999",
  },

  cartButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  count: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#C4C4C4",
  },
  countButton1: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#C4C4C4",
  },
  countButton2: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: "#C4C4C4",
  },
  comment: {
    fontSize: 16,
    color: "#111",
  },
  commentText: {
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wp("100%"),
    height: hp("100%"),
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: "#00000080",
  },
  modalView: {
    justifyContent: "space-between",
    width: wp("70%"),
    height: 200,
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
  },
  modalMain: {
    justifyContent: "center",
    alignItems: "center",
    height: 110,
  },
  modalTitle: {
    width: "80%",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  modalDescription: {
    width: "80%",
    textAlign: "center",
    fontSize: 13,
    color: colors.WHITE,
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderTopWidth: 2,
    borderTopColor: colors.BLACK,
  },
  saveText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0AB4FF",
  },
  cancelText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#F05050",
  },
  radioButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 10,
  },
  card: {
    width: "100%",
    marginTop: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.BLACK,
  },
  textContainer: {
    width: "100%",
    marginTop: 10,
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 20,
  },
  inputContainer: {
    marginTop: -23,
    borderWidth: 0,
    overflow: "scroll",
  },
  success: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  successButton: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 6,
    backgroundColor: "#FEEBD6",
  },
  successText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.YELLOW.PRIMARY,
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#999999",
  },
  mainText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#F78F1E",
  },
  mainDescription: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#111",
  },

  content1: {
    width: "100%",
  },
  selectView1: {
    marginTop: 20,
    width: "100%",
  },
  selectContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    borderColor: colors.GREY.PRIMARY,
  },
  streetView1: {
    marginTop: 40,
    width: "100%",
  },
  PhoneAndName: {
    marginTop: 10,
    width: '100%'
  },
  threeView1: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputView1: {
    width: "30%",
  },
  textContainer1: {
    width: "100%",
    marginTop: 10,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 20,
  },
  inputContainer1: {
    marginTop: -20,
    borderWidth: 0,
  },
  textContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: colors.GREY.PRIMARY,
  },
  inputContainer2: {
    width: '100%',
    marginTop: -20,
    borderWidth: 0,
  },
  itemText1: {
    width: "75%",
    fontSize: 16,
    textAlign: "left",
  },
  listView1: {
    width: "100%",
    // height: 250,
    paddingHorizontal: 10,
    backgroundColor: colors.WHITE,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.GREY.PRIMARY,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1
  },
  listView1height: {
    width: "100%",
    height: 250,
    paddingHorizontal: 10,
    backgroundColor: colors.WHITE,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.GREY.PRIMARY,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 2002
  },
  itemView1: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GREY.PRIMARY,
    zIndex: 2002
  },
  noborder1: {
    borderBottomWidth: 0,
  },
  labelText1: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.BLACK,
  },
  labelTextNormal1: {
    fontSize: 16,
    color: colors.BLACK,
  },
  couponCodeContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  couponCodeInput: {
    width: "70%",
    marginTop: 10,
    height: 50,
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingLeft: 15,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  couponCodeButton: {
    marginTop: 10,
    marginBottom: 20,
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  errorMessage: {
    color: '#FF000089'
  },
  upsellproduct_title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 8
  },
  product: {
    zIndex: 9999,
    marginBottom: 10,
    width: wp("80%") - 40,
    marginRight: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: colors.WHITE,
    shadowColor: "rgba(1, 1, 1, 0.6)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: Platform.OS === "ios" ? 0.5 : 0.7,
    shadowRadius: 5,
    elevation: 5,
  },
  productItemGroup: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    display: 'flex'
  },
  productItem: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    alignContent: 'space-between',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10
  },
  productItemText: {
    width: '100%'
  },
  productImage: {
    width: "30%",
    minHeight: 100,
    height: "100%",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderRightWidth: 1,
    borderRightColor: '#C4C4C4',
    marginRight: 8
  },
  productTitle: {
    width: "100%",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  productDescription: {
    marginTop: 8,
    width: "100%",
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
    color: "#666",
  },
  productItemBottom: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // alignSelf: 'flex-start',
    marginTop: 10
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.YELLOW.PRIMARY,
  },
  plusButton: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: '#F78F1E',
    borderColor: colors.WHITE,
  },
});
