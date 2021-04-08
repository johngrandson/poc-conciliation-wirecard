module.exports = {
  sales: {
    id: "REC-C0NC1L1VT10N",
    date: "2016-10-13", // Data de criação do arquivo de vendas
    type: "SALES",
    _links: {
      file:
        "https://s3.amazonaws.com/moip-conciliations/v2/MPA-M1NHVC0NTV/20151231/REC-C0NC1L1VT10N.json", // Link para download do arquivo de vendas em Json
    },
  },
  financials: {
    id: "REC-25UDG1DCL3AW",
    moipAccountId: "MPA-264SRFDB0A48",
    createdAt: "2019-01-31 19:58:16", // Data de criação do arquivo financeiro
    eventsCreatedAt: "2019-01-30", // Data da liquidação dos lançamentos financeiros
    type: "FINANCIALS",
    count: 6446, // Quantidade de lançamentos financeiros liquidados presentes no arquivo
    _links: {
      file:
        "https://s3.amazonaws.com/moip-reconciliation/prod/MPA-264SRFDB0A48/2019-01-30/REC-25UDG1DCL3AW.json", // Link para download do arquivo financeiro em Json
    },
  },
};
