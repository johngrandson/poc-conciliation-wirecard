require('dotenv').config()
const express = require("express");
const moment = require("moment");
const app = express();
const sales = require("./data/sales");
const financials = require("./data/financials");
const moipAccount = "MPA-4C55165A593A";

app.get("/sales/:date", async (req, res, next) => {
  try {
    const { params } = req;

    const [found] = sales.filter(
      (x) => moment(x.createdAt).format("YYYYMMDD") === params.date
    );
    if (found) {
      data = {
        id: found.id,
        date: moment(found.createdAt).format("YYYY-MM-DD"), //Data de criação do arquivo de vendas
        type: found.type,
        _links: {
          file: `${process.env.API_URL}/sales/download/${moipAccount}/${params.date}/${found.id}.json`, //Link para download do arquivo de vendas em Json
        },
      };

      return res.json(data);
    } else {
      return res.json({ statusCode: 404, message: "Nothing found!" });
    }
  } catch (error) {
    return res.json({
      statusCode: error.response.status,
      message: error.response.statusText,
    });
  }
});

app.get("/financials", async (req, res, next) => {
  try {
    const [found] = financials.filter(
      (x) =>
        x.eventsCreatedAt ===
        moment(req.query.eventsCreatedAt).format("YYYY-MM-DD")
    );

    if (found) {
      data = {
        id: found.id,
        moipAccountId: moipAccount,
        createdAt: found.createdAt, // Data de criação do arquivo financeiro
        eventsCreatedAt: found.eventsCreatedAt, // Data da liquidação dos lançamentos financeiros
        type: found.type,
        count: found.settledEntries.summary.count, // Quantidade de lançamentos financeiros liquidados presentes no arquivo
        _links: {
          file: `${process.env.API_URL}/financials/download/${moipAccount}/${req.query.eventsCreatedAt}/${found.id}.json`, // Link para download do arquivo financeiro em Json
        },
      };

      return res.json(data);
    }

    res.json({ statusCode: 404, message: "Nothing found!" });
  } catch (error) {
    console.log(`error`, error);
  }
});

app.get(
  "/financials/download/:moipAccount/:eventsCreatedAt/:id",
  async (req, res, next) => {
    try {
      const found = financials.filter(
        (x) =>
          x.eventsCreatedAt ===
            moment(req.params.eventsCreatedAt).format("YYYY-MM-DD") &&
          x.moipAccount === req.params.moipAccountId
      );

      if (found.length > 0) {
        return res.json(found);
      }
    } catch (error) {
      console.log(`error`, error);
    }
  }
);

app.get(
  "/sales/download/:moipAccount/:createdAt/:id",
  async (req, res, next) => {
    try {
      const [found] = sales.filter(
        (x) => moment(x.createdAt).format("YYYYMMDD") === req.params.createdAt
      );
      if (found) {
        return res.json(found);
      } else {
        return res.json({ statusCode: 404, message: "Nothing found" });
      }
    } catch (error) {
      console.log(`error`, error);
    }
  }
);

app.listen(3010, () => {
  console.log("Server running on port 3010");
});
