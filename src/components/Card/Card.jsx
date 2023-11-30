import styles from "./card.module.scss";
import { useEffect } from "react";
import {
  changeParam,
  changePeriod,
  fetchProduct,
  selectGraphParam,
  selectGraphPeriod,
  selectProduct,
  selectProductFetchStatus,
} from "./cardSlice";
import {
  graphData,
  paramsList,
  periodButtons,
  testIsin,
} from "../../utils/consts";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Card = () => {
  const dispatch = useAppDispatch();

  // period и param проще сделать через useState, но все равно уже используем Redux, почему бы и не в нем.
  // Как бонус, если в теории переходить по разным продуктам то сохранятся настройки графика
  const product = useAppSelector(selectProduct);
  const period = useAppSelector(selectGraphPeriod);
  const param = useAppSelector(selectGraphParam);
  const status = useAppSelector(selectProductFetchStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProduct({ isin: testIsin }));
    }
  }, [status, dispatch]);

  const renderButton = (button) => {
    return (
      <button
        key={button}
        disabled={period === button}
        onClick={() => dispatch(changePeriod(button))}
      >
        {button}
      </button>
    );
  };

  const renderSelect = () => {
    return (
      <select
        onChange={(e) => dispatch(changeParam(e.target.value))}
        className={styles.select}
        defaultValue="Yield"
      >
        {paramsList.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  };

  const getGraphData = () => {
    // фильтрация по количеству недель, считаю 1 элемент массива данных за 1 неделю,
    // месяц за 4 недели, квартал за 12, год за 48, чтобы не усложнять задачу, и данные все равно рандомные
    switch (period) {
      case "Week":
        return graphData.slice(-1);
      case "Month":
        return graphData.slice(-4);
      case "Quarter":
        return graphData.slice(-12);
      case "Year":
        return graphData.slice(-48);
      default:
        return graphData;
    }
  };
  const getDatakey = () => {
    switch (param) {
      case "Spread":
        return "sp";
      case "Price":
        return "pr";
      default:
        return "yi";
    }
  };

  if (status !== "succeeded") {
    return (
      <div className={styles.card}>
        <h1 className={styles.header}>Fetching product...</h1>
      </div>
    );
  }

  const { isin, issuer, issuer_full, currency, price, maturity_date } = product;

  return (
    <div className={styles.card}>
      <h1 className={styles.header}>
        <div className={styles.header__issuer}>{issuer}</div>
        <div>{price?.toFixed(2)}</div>
        <div className={styles.header__currency}>{currency}</div>
      </h1>
      <div className={styles.info}>
        <div className={styles.info__isin}>{isin}</div>
        <div>{issuer_full},</div>
        <div> till {maturity_date}</div>
      </div>
      <div>
        {periodButtons.map(renderButton)}
        {renderSelect()}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={getGraphData()}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={getDatakey()}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Card;
