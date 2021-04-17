import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Container, Content, Header } from "native-base";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Icon } from "react-native-elements";
import { setLoading } from "@modules/reducers/auth/actions";
import { setCartProducts, setCartBadge, setCartToast } from "@modules/reducers/food/actions";
import { FoodService } from "@modules/services";
import { isEmpty } from "@utils/functions";
import { common, colors } from "@constants/themes";
import {
  TrustIcon,
  CartYellowIcon,
  CartWhiteIcon,
  WarningIcon,
} from "@constants/svgs";
import { RES_URL } from "@constants/configs";
import FastImage from "react-native-fast-image";
import i18n from "@utils/i18n";

const BOTTOM_BUTTON_DISTANCE = Platform.OS === 'ios' ? 40 : 26;

const CartItem = ({
  cartRestaurant,
  cartProduct,
  index,
  onSelect,
  onDelete,
}) => {
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
      {/* <Text style={styles.allergen}>
        {cartProduct.productDescription}
      </Text>
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
      ) : null} */}
      {!isEmpty(cartProduct.extras)
        ? cartProduct.extras.map((extra, key) => (
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

export default CartIndex = (props) => {
  const dispatch = useDispatch();
  const { logged, country, city, user } = useSelector((state) => state.auth);
  const { cartRestaurant, cartProducts, cartBadge } = useSelector(
    (state) => state.food
  );

  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(false);
  const [checkTemp, setCheckTemp] = useState(false);
  const [itemTemp, setItemTemp] = useState(null);
  const [countTemp, setCountTemp] = useState(0);
  const [total, setTotal] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [visibleNotiPlus, setVisibleNotiPlus] = useState(0);
  const [visibleNotiMinus, setVisibleNotiMinus] = useState(0);
  const [isExtra, setIsExtra] = useState(0);
  const [upSellProducts, setUpSellProducts] = useState([]);

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

  const onDelete = (check, item, count) => {
    setType(false);
    setCheckTemp(check);
    setItemTemp(item);
    setCountTemp(count);
    setVisible(true);
  };

  const onSelect = (check, item, count, visibleNotiStatus) => {
    console.log("visible noti = ", visibleNotiStatus);
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
      dispatch(setCartBadge(totalBadge));
      dispatch(setCartProducts(cartProducts));

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
      dispatch(setCartBadge(totalBadge));
      dispatch(setCartProducts(result));
      // dispatch(setCartBadge(cartBadge - 1));
      if (isEmpty(result)) props.navigation.goBack();
    }
    setVisible(false);
  };

  const onEmpty = () => {
    dispatch(setCartBadge(0));
    dispatch(setCartProducts([]));
    setVisible(false);

    props.navigation.goBack();
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
    <Container style={common.container}>
      {/* <StatusBar /> */}
      <Header style={common.header}>
        <View style={common.headerLeft}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon
              type="material"
              name="arrow-back"
              size={30}
              color={colors.YELLOW.PRIMARY}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={common.headerTitle}>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={common.headerTitleText} numberOfLines={1}>
              {i18n.translate("Basket")}
            </Text>
            <Text>{cartRestaurant.restaurant_name}</Text>
          </View>
        </TouchableOpacity>

        <View style={common.headerRight}>
          {/* <TouchableOpacity>
            {cartBadge > 0 ? (
              <Fragment>
                <CartYellowIcon />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartBadge}</Text>
                </View>
              </Fragment>
            ) : (
              <Fragment>
                <CartYellowIcon />
                <View style={styles.badgeEmpty} />
              </Fragment>
            )}
          </TouchableOpacity> */}
        </View>
      </Header>
      <Content style={styles.cartItemContent}>
        {isExtra == 1 && visibleNotiPlus == 1 && (
          <View style={styles.notificationBack}>
            <WarningIcon />
            <Text style={styles.notification}>
              {" "}
              {i18n.translate("increase items")}
            </Text>
          </View>
        )}
        {isExtra == 1 && visibleNotiMinus == 1 && (
          <View style={styles.notificationBack}>
            <WarningIcon />
            <Text style={styles.notification}>
              {" "}
              {i18n.translate("decrease items")}
            </Text>
          </View>
        )}
        {!isEmpty(cartProducts) && (
          <Fragment>
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
          </Fragment>
        )}
        {!isEmpty(upSellProducts) && (
          <Fragment>
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
          </Fragment>
        )}
        <View style={styles.cartItemtContentBottom}></View>
      </Content>
      <View style={styles.goToOrder}>
        <View style={styles.amount}>
          <Text style={styles.orderPrice}>
            {i18n.translate("Total")}
          </Text>
          <Text style={styles.orderPrice}>
            {total.toFixed(2)}{" "}{i18n.translate("lei")}
          </Text>
        </View>
        <View
          style={styles.orderButtonView}
        >
          <TouchableOpacity
            style={[
              styles.button,
              disabled
                ? common.backColorGrey
                : '#F78F1E',
            ]}
            disabled={
              disabled
            }
            onPress={() => {
              setDisabled(true);
              props.navigation.push("CartDetail");
              setTimeout(() => setDisabled(false), 1000);
            }}
          >
            <Text style={styles.buttonText}>
              {i18n.translate("Send order")}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
                onPress={() => {
                  setType(true);
                  setVisible(true);
                }}
              >
                <Text style={styles.price}>
                  {i18n.translate("Delete cart items")}
                </Text>
              </TouchableOpacity> */}
        </View>
      </View>
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
              onPress={() => {
                !type
                  ? onSelect(checkTemp, itemTemp, countTemp, "+")
                  : onEmpty();
              }}
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
    </Container>
  );
};

const styles = StyleSheet.create({
  notificationBack: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: "#feebd6",
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: Platform.OS === "ios" ? 0.5 : 0.7,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 2002
  },
  notification: {
    fontSize: 16,
    marginLeft: 3,
    color: colors.YELLOW.PRIMARY,
  },
  cartItemContent: {
    flex: 1,
    padding: 20
  },
  cartItemtContentBottom: {
    height: 160,
  },
  descriptionText: {
    width: "100%",
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
    lineHeight: 24,
    marginBottom: 10,
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
    marginTop: 15,
    width: "100%",
    fontSize: 16,
    color: colors.BLACK,
  },
  extra: {
    fontSize: 16,
    color: colors.BLACK,
  },
  cartBottom: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  cartLeft: {
    alignItems: "flex-start",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.YELLOW.PRIMARY,
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
  amount: {
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
  mimimumAlert: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#C4C4C4",
  },
  subscription: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#6D6D6D",
  },
  orderButtonView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.YELLOW.PRIMARY,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
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
  upsellproduct_title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 8
  },
  product: {
    marginBottom: 10,
    width: wp("80%") - 40,
    marginRight: 10,
    borderRadius: 6,
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
