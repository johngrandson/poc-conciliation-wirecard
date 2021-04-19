const { default: axios } = require("axios");
const express = require("express");
const moment = require("moment");
const app = express();
const sales = require("./data/sales");
const financials = require("./data/financials");
const moipAccount = "MPA-4C55165A593A";

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

    const [found] = sales.filter(
      (x) => moment(x.createdAt).format("YYYYMMDD") === params.date
    );

    if (found) {
      let {
        data: [sale],
      } = await axios.get(
        `http://localhost:3011/sales?createdAt=${found.createdAt}`
      );

      data = {
        id: sale.id,
        date: moment(sale.createdAt).format("YYYY-MM-DD"), //Data de criação do arquivo de vendas
        type: sale.type,
        _links: {
          file: `http://localhost:3010/sales/download/${moipAccount}/${params.date}/${sale.id}.json`, //Link para download do arquivo de vendas em Json
        },
      };

      if (sale) {
        return res.json(data);
      }
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
    const found = financials.filter(
      (x) =>
        x.eventsCreatedAt ===
        moment(req.query.eventsCreatedAt).format("YYYY-MM-DD")
    );

    if (found.length > 0) {
      let {
        data: [financial],
      } = await axios.get(
        `http://localhost:3011/financials?eventsCreatedAt=${req.query.eventsCreatedAt}`
      );

      data = {
        id: financial.id,
        moipAccountId: moipAccount,
        createdAt: financial.createdAt, // Data de criação do arquivo financeiro
        eventsCreatedAt: financial.eventsCreatedAt, // Data da liquidação dos lançamentos financeiros
        type: financial.type,
        count: financial.settledEntries.summary.count, // Quantidade de lançamentos financeiros liquidados presentes no arquivo
        _links: {
          file: `http://localhost:3010/financials/download/${moipAccount}/${req.query.eventsCreatedAt}/${financial.id}.json`, // Link para download do arquivo financeiro em Json
        },
      };

      if (financial) {
        return res.json(data);
      }
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
        let {
          data: [payload],
        } = await axios.get(
          `http://localhost:3011/financials?eventsCreatedAt=${req.params.eventsCreatedAt}`
        );

        if (payload) {
          return downloadData(payload, res);
        }
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
        let {
          data: [payload],
        } = await axios.get(
          `http://localhost:3011/sales?createdAt=${found.createdAt}`
        );

        if (payload) {
          return downloadData(payload, res);
        }
      }
    } catch (error) {
      console.log(`error`, error);
    }
  }
);

app.listen(3010, () => {
  console.log("Server running on port 3010");
});
