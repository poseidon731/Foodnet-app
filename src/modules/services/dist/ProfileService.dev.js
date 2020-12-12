"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireWildcard(require("@utils/axios"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ProfileService = {
  getDeliveryList: function getDeliveryList(token, country) {
    console.log(country);
    (0, _axios.setClientToken)(token);
    return _axios["default"].get("/delivery-address/".concat(country)).then(function (response) {
      (0, _axios.removeClientToken)();
      console.log(token, response.data);
      return response.data;
    });
  },
  setDeliveryAddress: function setDeliveryAddress(token, id, city, street, houseNumber, floor, doorNumber) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].post("/delivery-address", {
      houseNumber: houseNumber,
      street: street,
      city: city.cities,
      floor: floor,
      doorNumber: doorNumber,
      deliveryAddressId: id,
      locationNameId: city.id,
      operation: id === 0 ? 'create' : 'update'
    }).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  deleteDeliveryAddress: function deleteDeliveryAddress(token, id) {
    (0, _axios.setClientToken)(token);
    return _axios["default"]["delete"]("/delivery-address/".concat(id)).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  getProfileInformation: function getProfileInformation(token) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].get("/profile/me").then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  modifyProfileInformation: function modifyProfileInformation(token, fullName, email, phoneNumber) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].post("/profile/me", {
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber
    }).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  deleteProfile: function deleteProfile(token) {
    (0, _axios.setClientToken)(token);
    return _axios["default"]["delete"]("/profile").then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  modifyProfilePassword: function modifyProfilePassword(token, oldPassword, newPassword, newPasswordAgain) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].post("/profile/change-password", {
      oldPassword: oldPassword,
      newPassword: newPassword,
      newPasswordAgain: newPasswordAgain
    }).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  addReviews: function addReviews(token) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].get("/restaurant-review/addition-list").then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  viewReviews: function viewReviews(token) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].get("/restaurant-review/added-list").then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  getReview: function getReview(token, reviewId) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].get("/restaurant-review/".concat(reviewId)).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  setReview: function setReview(token, genLink, rating, message) {
    (0, _axios.setClientToken)(token);
    return _axios["default"].post("/restaurant-review", {
      genLink: genLink,
      rating: rating,
      message: message
    }).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  },
  deleteReview: function deleteReview(token, reviewId) {
    (0, _axios.setClientToken)(token);
    return _axios["default"]["delete"]("/restaurant-review/".concat(reviewId)).then(function (response) {
      (0, _axios.removeClientToken)();
      return response.data;
    });
  }
};
var _default = ProfileService;
exports["default"] = _default;