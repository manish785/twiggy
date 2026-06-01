import {
  cartDataLoading,
  cartDataSuccess,
  ManageQuantity,
  deleteCartItem,
  address,
  successfullypayment,
  clearCartData,
} from "./actionType";

export const addToCart = (data) => (dispatch) => {
  dispatch({ type: cartDataLoading });

  dispatch({
    type: cartDataSuccess,
    payload: data,
  });
};

export const manageQuantityOfData = (index, productQuantity) => (dispatch) => {
  dispatch({
    type: ManageQuantity,
    payload: { index, productQuantity },
  });
};

export const removeItem = (index) => (dispatch) => {
  dispatch({
    type: deleteCartItem,
    payload: index,
  });
};

export const Address = (data) => (dispatch) => {
  dispatch({
    type: address,
    payload: data,
  });
};

export const successPayment = () => (dispatch) => {
  dispatch({
    type: successfullypayment,
  });
};

export const clearCart = () => (dispatch) => {
  dispatch({
    type: clearCartData,
  });
};