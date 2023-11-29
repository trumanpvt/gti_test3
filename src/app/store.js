import { configureStore } from "@reduxjs/toolkit";
import cardSlice from "../components/Card/cardSlice";

export default configureStore({
  reducer: { card: cardSlice },
});
