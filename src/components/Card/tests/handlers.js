import { rest } from "msw";
import { apiUrl, testIsin } from "../../../utils/consts";

export const testData = {
  isin: "RU000A1059R0",
  issuer: 'Нефтяная компания "ЛУКОЙЛ"',
  issuer_full: 'Публичное акционерное общество "Нефтяная компания "ЛУКОЙЛ""',
  name: "ЛУКОЙЛ 31",
  name_full: 'ПАО "ЛУКОЙЛ" ЗО-31',
  currency: "RUB",
  price: 77089.987898,
  yield: 5.74,
  coupon: 18,
  maturity_date: "26.10.2031",
  coupon_payment_date: "26.04.2024",
};
export const handlers = [
  rest.get(`${apiUrl}/${testIsin}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testData));
  }),
];
