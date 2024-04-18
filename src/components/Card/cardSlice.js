import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiUrl } from "../../utils/consts";

const initialState = {
  product: {},
  period: "Month",
  param: "Yield",
  status: "idle",
  error: null,
};
const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    changePeriod: (state, action) => {
      state.period = action.payload;
    },
    changeParam: (state, action) => {
      state.param = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action?.error.message;
      });
  },
});

export const { changePeriod, changeParam } = cardSlice.actions;

export const fetchProduct = createAsyncThunk(
  "card/fetchProduct",
  async ({ isin }) => {
    const response = await fetch(`${apiUrl}/${isin}`);
    return response.json();
  },
);

export const selectProduct = (state) => state.card.product;
export const selectProductFetchStatus = (state) => state.card.status;
export const selectGraphParam = (state) => state.card.param;
export const selectGraphPeriod = (state) => state.card.period;

export default cardSlice.reducer;
