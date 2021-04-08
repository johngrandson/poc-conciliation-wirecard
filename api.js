const { default: axios } = require("axios");
const express = require("express");
const moment = require("moment");
const app = express();
const db = require("./responses");

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
    const { sales } = db;

    const found =
      params.date === moment(sales.date).format("YYYYMMDD") ? true : false;

    if (found) {
      const { data } = await axios.get("http://localhost:3011/sales-response");

      return downloadData(data, res);
    } else {
      res.json({ message: "Nothing found!" });
    }
  } catch (error) {
    console.log(`error`, error);
  }
});

app.get("/financials", async (req, res, next) => {
  try {
    const { query } = req;
    const { financials } = db;

    const found =
      query.eventsCreatedAt === financials.eventsCreatedAt ? true : false;

    if (found) {
      const { data } = await axios.get(
        "http://localhost:3011/financials-response"
      );

      return downloadData(data, res);
    } else {
      res.json({ message: "Nothing found!" });
    }
  } catch (error) {
    console.log(`error`, error);
  }
});

app.listen(3010, () => {
  console.log("Server running on port 3010");
});
