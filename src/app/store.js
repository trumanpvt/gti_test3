import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cardReducer from "../components/Card/cardSlice";

const rootReducer = combineReducers({
  card: cardReducer,
});

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};
