import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    //Add purchase
    addPurchae: (state, actions) => {
      if (!Array.isArray(state)) {
        return [
          {
            product_id: "",
            qty: 1,
            cost: 0,
            retail_price: 0,
            remark: "",
            ref: "",
          },
        ];
      }
      state.push({
        product_id: "",
        qty: 1,
        cost: 0,
        retail_price: 0,
        remark: "",
        ref: "",
      });
    },

    //Update purchase
    updatePuchase: (state, actions) => {
      const { index, field, value } = actions.payload;
      if (state[index]) {
        state[index][field] = value;
      }
    },

    // delete purchase
    deletePuchase: (state, actions) => {
      const index = actions.payload;
      state.splice(index, 1);
    },

    clearAllPurchase: () => initialState,
  },
});
export const { addPurchae, clearAllPurchase, deletePuchase, updatePuchase } =
  purchaseSlice.actions;
export default purchaseSlice.reducer;
