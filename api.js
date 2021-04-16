const { default: axios } = require("axios");
const express = require("express");
const moment = require("moment");
const app = express();
const sales = require("./data/sales");
const financials = require("./data/financials");

const downloadData = (data, res) => {
  const json = JSON.stringify(data);
  const filename = `${data.id}-${moment(
    data.date || data.eventsCreatedAt
  ).format("YYYYMMDD")}.json`;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.send(json);
};

app.get("/sales/:date", async (req, res, next) => {
  try {
    const { params } = req;

    const found =
      params.date === moment(sales.date).format("YYYYMMDD") ? true : false;

    if (found) {
      const { data } = await axios.get(
        `http://localhost:3011/sales/${params.date}`
      );

      return downloadData(data, res);
    } else {
      res.json({ statusCode: 404, message: "Nothing found!" });
    }
  } catch (error) {
    console.log(`error`, error);
  }
});

app.get("/financials", async (req, res, next) => {
  try {
    const found = financials.filter(
      (x) =>
        x.eventsCreatedAt ===
        moment(req.query.eventsCreatedAt).format("YYYY-MM-DD")
    );

    if (found.length > 0) {
      const { data } = await axios.get(
        `http://localhost:3011/financials?eventsCreatedAt=${req.query.eventsCreatedAt}`
      );

      if (data.length > 0) {
        return downloadData(...data, res);
      }
    }

    res.json({ statusCode: 404, message: "Nothing found!" });
  } catch (error) {
    console.log(`error`, error);
  }
});

app.listen(3010, () => {
  console.log("Server running on port 3010");
});
