import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Platform,
  StatusBar,
  StyleSheet,
  LogBox,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Icon } from "react-native-elements";
import Card from "../Athena/Card";
import { setLoading } from "@modules/reducers/auth/actions";
import {
  setCartRestaurant,
  setCartProducts,
  setCartBadge,
  setCartToast,
} from "@modules/reducers/food/actions";
import { FoodService } from "@modules/services";
import { isEmpty } from "@utils/functions";
import { common, colors } from "@constants/themes";
import { RES_URL } from "@constants/configs";
import { CartWhiteIcon } from "@constants/svgs";
import i18n from "@utils/i18n";

import moment from "moment";
import { TextField } from "react-native-material-textfield";
import FastImage from "react-native-fast-image";
import ContentLoader from "react-native-easy-content-loader";

const Product = ({
  cartRestaurant,
  cartProducts,
  restaurant,
  product,
  index,
  subCategoryIndex,
  onExtra,
  onModal,
  onCart,
}) => {
  const [loader, setLoader] = useState(true);
  const [count, setCount] = useState(1);
  const [flag, setFlag] = useState(false);
  const [isToday, setIsToday] = useState(0);

  useEffect(() => {
    if (isEmpty(cartProducts)) {
      return;
    } else {
      var index = cartProducts.findIndex((cartProduct) => {
        return (
          cartRestaurant.restaurant_id == restaurant.restaurant_id &&
          cartProduct.productId == product.product_id &&
          cartProduct.variantId == product.variant_id
        );
      });
      if (index >= 0) {
        // setCount(cartProducts[index].quantity);
        // setFlag(true);
      }
    }
  });

  useEffect(() => {
    if (product.isDailyMenu == 1) {
      var d = new Date();
      var n = d.getDay();
      if (subCategoryIndex == (n === 0 ? 6 : n - 1)) setIsToday(1);
    }
  }, [subCategoryIndex]);

  return (
    <Fragment>
      <ContentLoader
        active
        title={false}
        pRows={3}
        pWidth={["100%", "90%", "50%", 50]}
        pHeight={[125, 10, 8, 20]}
        loading={loader}
        containerStyles={styles.loader}
      />
      <TouchableOpacity key={index} style={loader ? styles.default : styles.product}
        disabled={
          parseInt(moment().format("HH:mm").replace(":", "")) <=
          parseInt(restaurant.restaurant_open.replace(":", "")) ||
          parseInt(moment().format("HH:mm").replace(":", "")) >=
          parseInt(restaurant.restaurant_close.replace(":", "")) ||
          (!isEmpty(product.startTime) &&
            product.startTime > moment().format("HH:mm")) ||
          (!isEmpty(product.endTime) &&
            moment().format("HH:mm") > product.endTime) ||
          (product.isDailyMenu == 1 && product.soldOut == 1) ||
          (product.isDailyMenu == 1 && isToday == 0) ||
          (product.isDailyMenu == 0 && product.soldOut == 0)
        }
        onPress={() => {
          if (
            !isEmpty(cartProducts) &&
            cartRestaurant.restaurant_id != restaurant.restaurant_id
          ) {
            onModal();
          } else {
            flag ? onCart() : onExtra(product, count);
            // checkExtr(cartProducts, restaurant, product, count);
          }
        }}
      >
        {((!isEmpty(product.startTime) &&
          product.startTime > moment().format("HH:mm")) ||
          (!isEmpty(product.endTime) &&
            moment().format("HH:mm") > product.endTime) ||
          (product.isDailyMenu == 1 && product.soldOut == 1) ||
          (product.isDailyMenu == 1 && isToday == 0) ||
          (product.isDailyMenu == 0 && product.soldOut == 0)) && (
            <View style={styles.productImageSold}>
              <Text style={styles.productImageSoldText}>
                {i18n.translate("Sold Out")}
              </Text>
            </View>
          )}

        <View style={styles.productItem} >
          <View style={styles.productItemText}>
            <Text style={styles.productTitle}>
              {product.product_name}
            </Text>
            <Text style={styles.productDescription}>
              {product.product_description}
            </Text>
          </View>
          <View style={styles.productItemBottom}>
            <Text style={styles.price}>
              {product.product_price.toFixed(2)} {i18n.translate("lei")}
            </Text>
            {!isEmpty(product.soldOut) && (
              !isEmpty(product.startTime) && !isEmpty(product.endTime) && (
                <Text style={styles.dailyWrapperText} numberOfLines={1}>
                  {i18n.translate("Order time")}
                  {": "}{product.startTime}-{product.endTime}
                </Text>
              )
            )}
          </View>

        </View>
        <FastImage
          style={styles.productImage}
          source={{ uri: RES_URL + product.product_imageUrl }}
          resizeMode="cover"
          onLoadEnd={(e) => setLoader(false)}
        />
        {/* <View style={styles.productCart}>

          <View style={styles.cart}>
            <TouchableOpacity
              style={styles.countButton1}
              disabled={count == 1 || flag}
              onPress={() => count > 1 && setCount(count - 1)}
            >
              <Icon
                type="material-community"
                name="minus"
                color="#333"
                size={25}
              />
            </TouchableOpacity>
            <View style={styles.count}>
              <Text style={{ color: "#333" }}>{count} db</Text>
            </View>
            <TouchableOpacity
              style={styles.countButton2}
              disabled={flag}
              onPress={() => setCount(count + 1)}
            >
              <Icon
                type="material-community"
                name="plus"
                color="#333"
                size={25}
              />
            </TouchableOpacity>
            <View style={{ width: 10 }} />
            <TouchableOpacity
              style={[
                styles.check,
                {
                  backgroundColor:
                    parseInt(moment().format("HH:mm").replace(":", "")) <=
                      parseInt(restaurant.restaurant_open.replace(":", "")) ||
                    parseInt(moment().format("HH:mm").replace(":", "")) >=
                      parseInt(restaurant.restaurant_close.replace(":", "")) ||
                    (!isEmpty(product.startTime) &&
                      product.startTime > moment().format("HH:mm")) ||
                    (!isEmpty(product.endTime) &&
                      moment().format("HH:mm") > product.endTime) ||
                    (product.isDailyMenu == 1 && product.soldOut == 1) ||
                    (product.isDailyMenu == 1 && isToday == 0) ||
                    (product.isDailyMenu == 0 && product.soldOut == 0)
                      ? "#F78F1E80"
                      : colors.YELLOW.PRIMARY,
                },
              ]}
              disabled={
                parseInt(moment().format("HH:mm").replace(":", "")) <=
                  parseInt(restaurant.restaurant_open.replace(":", "")) ||
                parseInt(moment().format("HH:mm").replace(":", "")) >=
                  parseInt(restaurant.restaurant_close.replace(":", "")) ||
                (!isEmpty(product.startTime) &&
                  product.startTime > moment().format("HH:mm")) ||
                (!isEmpty(product.endTime) &&
                  moment().format("HH:mm") > product.endTime) ||
                (product.isDailyMenu == 1 && product.soldOut == 1) ||
                (product.isDailyMenu == 1 && isToday == 0) ||
                (product.isDailyMenu == 0 && product.soldOut == 0)
              }
              onPress={() => {
                if (
                  !isEmpty(cartProducts) &&
                  cartRestaurant.restaurant_id != restaurant.restaurant_id
                ) {
                  onModal();
                } else {
                  flag ? onCart() : onExtra(product, count);
                  // checkExtr(cartProducts, restaurant, product, count);
                }
              }}
            >
              {flag ? (
                <Icon
                  type="material"
                  name="check"
                  color={colors.WHITE}
                  size={25}
                />
              ) : (
                <CartWhiteIcon />
              )}
            </TouchableOpacity>
          </View>
        </View> */}
      </TouchableOpacity>
    </Fragment>
  );
};

export default Menu = (props) => {
  const dispatch = useDispatch();
  const { country } = useSelector((state) => state.auth);
  const { cartRestaurant, cartProducts } = useSelector((state) => state.food);

  const [products, setProducts] = useState([]);

  const [subCategoryIndex, setSubCategoryIndex] = useState(
    props.subCategory.index
  );

  useEffect(
    () => LogBox.ignoreLogs(["VirtualizedLists should never be nested"]),
    []
  );

  useEffect(() => {
    if (!isEmpty(props.categories) && !isEmpty(props.subCategories)) {
      dispatch(setLoading(true));
    }
    if (props.category.category_id != 0 && props.subCategory.subcategoryId != 0) {
      console.log(props.category.category_id, "sub = ", props.subCategory);
      setSubCategoryIndex(props.subCategory.index);
      setProducts([]);
      FoodService.products(
        country,
        props.restaurant.restaurant_id,
        props.category.category_id,
        props.subCategory.subcategoryId,
        props.subCategory.propertyValTransId,
        props.search
      )
        .then(async (response) => {
          dispatch(setLoading(false));
          if (response.status == 200) {
            setProducts(response.result);
          } else {
            // dispatch(setLoading(false));
            setProducts([]);
          }
        })
        .catch((error) => {
          dispatch(setLoading(false));
          setProducts([]);
        });
    }

  }, [props.subCategory, cartRestaurant, cartProducts]);

  useEffect(() => {
    setProducts([]);
    if (props.category.category_id != 0 && props.subCategory.subcategoryId != 0) {
      console.log(props.category.category_id, "search = ", props.subCategory);
      FoodService.products(
        country,
        props.restaurant.restaurant_id,
        props.category.category_id,
        props.subCategory.subcategoryId,
        props.subCategory.propertyValTransId,
        props.search
      )
        .then(async (response) => {
          if (response.status == 200) {
            setProducts(response.result);
          } else {
            // dispatch(setLoading(false));
            setProducts([]);
          }
        })
        .catch((error) => {
          setProducts([]);
        });
    }
  }, [props.search]);

  return (
    <View style={styles.container}>
      <View style={{ height: 20 }} />
      <Card key="menu" style={styles.card}>
        <Text style={styles.cardTitle}>{i18n.translate("Menu")}</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={props.categories}
          keyExtractor={(category, index) => index.toString()}
          renderItem={(item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.category,
                props.category.category_id == item.item.category_id
                  ? common.borderColorYellow
                  : common.borderColorGrey,
              ]}
              onPress={() => {
                this.textInput.clear();
                props.onCategory(item.item);
              }}
            >
              <Text style={styles.name}>{item.item.category_name}</Text>
            </TouchableOpacity>
          )}
        />
      </Card>
      <View style={{ height: 10 }} />
      <Card key="subcategories" style={styles.card}>
        <Text style={styles.cardTitle}>
          {i18n.translate("What kind of ")}
          {props.category.category_name}
          {i18n.translate("do you care about?")}
        </Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={props.subCategories}
          keyExtractor={(subCategory, index) => index.toString()}
          renderItem={(item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.category,
                props.subCategory.propertyValTransId ==
                  item.item.propertyValTransId
                  ? common.borderColorYellow
                  : common.borderColorGrey,
              ]}
              onPress={() => {
                this.textInput.clear();
                props.onSubCategory(item.item);
              }}
            >
              <Text style={styles.name}>{item.item.subcategories_name}</Text>
            </TouchableOpacity>
          )}
        />
      </Card>
      <View style={{ height: 10 }} />
      <Card key="food" style={styles.card}>
        <TextField
          placeholder={i18n.translate("Name of food")}
          placeholderTextColor="#666"
          fontSize={16}
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          // value={props.search}
          ref={(input) => {
            this.textInput = input;
          }}
          containerStyle={styles.textContainer}
          inputContainerStyle={styles.inputContainer}
          lineWidth={0}
          activeLineWidth={0}
          onChangeText={(value) => props.onSearch(value)}
        />
      </Card>
      {isEmpty(products) ? (
        <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
          <Text style={[styles.cardTitle, { textAlign: "center" }]}>
            {i18n.translate("No Menu")}
          </Text>
        </View>
      ) : (
        <Card key="product" style={styles.card}>
          {/* <Text style={[styles.cardTitle, { marginTop: 20, fontSize: 14 }]}>{props.category.category_name} - {props.subCategory.subcategories_name}</Text> */}
          <FlatList
            contentContainerStyle={{ paddingVertical: 20 }}
            showsHorizontalScrollIndicator={false}
            data={products}
            keyExtractor={(product, index) => index.toString()}
            renderItem={(product, index) => (
              <Product
                cartRestaurant={cartRestaurant}
                cartProducts={cartProducts}
                restaurant={props.restaurant}
                product={product.item}
                index={index}
                subCategoryIndex={subCategoryIndex}
                onExtra={props.onExtra}
                onCart={props.onCart}
                onModal={props.onModal}
              />
            )}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20
  },
  card: {
    marginHorizontal: 20,
    width: wp("100%") - 40,
  },
  cardTitle: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    width: "100%",
  },
  category: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: colors.YELLOW.PRIMARY,
    borderRadius: 6,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    color: "#333",
  },
  textContainer: {
    width: wp("100%") - 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 20,
    borderColor: colors.GREY.PRIMARY,
  },
  inputContainer: {
    marginTop: -20,
    borderWidth: 0,
  },
  loader: {
    marginBottom: 24,
    width: wp("100%") - 40,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: colors.WHITE,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: Platform.OS === "ios" ? 10 : 0,
      height: Platform.OS === "ios" ? 12 : 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: Platform.OS === "ios" ? 24 : 5,
    borderRadius: 6,
  },
  default: {
    height: 0,
  },
  product: {
    marginBottom: 10,
    width: wp("100%") - 40,
    paddingBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    display: 'flex'
  },
  productItem: {
    paddingRight: 5,
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    alignContent: 'space-between'
  },
  productItemText: {
    width: '100%'
  },
  productImage: {
    width: "30%",
    height: 100,
    borderRadius: 6,
    marginTop: 10
  },
  productImageSold: {
    position: "absolute",
    top: 15,
    right: 5,
    width: "30%",
    height: 100,
    borderRadius: 6,
    zIndex: 2000,
    backgroundColor: "#000000D0",
    justifyContent: "center",
    alignItems: "center",
  },
  productImageSoldText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.WHITE,
    textAlign: "center",
  },
  productTitle: {
    width: "100%",
    // marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  productDescription: {
    marginTop: 8,
    width: "100%",
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 18.2,
    color: "#666",
  },
  allergenList: {
    marginTop: 12,
    width: "100%",
    fontSize: 16,
    color: "#999",
  },
  allergen: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
  productCart: {
    marginTop: 26,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productItemBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.YELLOW.PRIMARY,
    // width: '45%',
    textAlign: 'left'
  },
  cart: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  check: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: colors.YELLOW.PRIMARY,
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
  dailyWrapperText: {
    fontSize: 13,
    color: "#333",
    fontWeight: '700',
    // width: '55%',
    textAlign: 'right'
  },
  extrasText: {
    width: "100%",
    fontSize: 16,
    color: "#333",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    zIndex: 2000,
  }
});
