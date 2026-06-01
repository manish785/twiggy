import {
  cartDataLoading,
  cartDataSuccess,
  ManageQuantity,
  deleteCartItem,
  address,
  successfullypayment,
  clearCartData,
} from "./actionType";

export const cartInitialState = {
  loading: false,
  data: [],
  itemCount: 0,
  totalCartPrice: 0,
  deliveryAddress: {},
};

const initialState = cartInitialState;

export function calculateTotals(items) {
  const itemCount = items.reduce(
    (acc, item) => acc + Number(item.productQuantity || 0),
    0
  );
  const totalCartPrice = items.reduce(
    (acc, item) => acc + item.price * item.productQuantity,
    0
  );

  return { itemCount, totalCartPrice };
}

export const cartReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case cartDataLoading:
      return { ...state, loading: true };

    case cartDataSuccess: {
      const existingIndex = state.data.findIndex((item) => item.id === payload.id);
      let updatedData;

      if (existingIndex >= 0) {
        updatedData = state.data.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                productQuantity:
                  item.productQuantity + (payload.productQuantity || 1),
              }
            : item
        );
      } else {
        updatedData = [...state.data, payload];
      }

      const totals = calculateTotals(updatedData);

      return {
        ...state,
        loading: false,
        data: updatedData,
        ...totals,
      };
    }

    case ManageQuantity: {
      const newData = state.data.map((item, index) =>
        index === payload.index
          ? { ...item, productQuantity: payload.productQuantity }
          : item
      );
      const totals = calculateTotals(newData);

      return { ...state, data: newData, ...totals };
    }

    case deleteCartItem: {
      const newData = state.data.filter((_, index) => index !== payload);
      const totals = calculateTotals(newData);

      return { ...state, data: newData, ...totals };
    }

    case address:
      return { ...state, deliveryAddress: payload };

    case successfullypayment:
    case clearCartData:
      return { ...initialState };

    default:
      return state;
  }
};
