# POC conciliation-wirecard


## Instalando dependências
```bash
$ yarn
```

## Rodando o projeto
```bash
$ yarn start
```

## Rotas

### GET - Obter Arquivo de Vendas
**Path params:**
**date*** ```date```
Data no formato **YYYYMMDD**.

**exemplo**: http://localhost:3010/sales/20210409


**response**

- 200:
  ```json
  {
    "id": "REC-C0NC1L1VT10N",
    "date": "2016-10-13",
    "type": "SALES",
    "_links": {
      "file": "http://localhost:3011/sales/download/MPA-4C55165A593A/20210409/REC-DTL53BYBVCGV.json"
    }
  }
  ```
- 404:
  ```json
  {
    "statusCode": 404,
    "message": "Nothing found!"
  }
  ```


##

### GET - Obter Arquivo Financeiro
**Query params:**
**eventsCreatedAt*** ```date```
Data referente à liquidação dos lançamentos financeiros. Formato: **YYYY-MM-DD**.

**exemplo**: http://localhost:3010/financials?eventsCreatedAt=2021-04-05

**response**

- **200**:
  ```json
  {
    "id": "REC-28CMIFE4OKYD",
    "moipAccountId": "MPA-4C55165A593A",
    "createdAt": "2021-04-09T16:36:36-0300",
    "eventsCreatedAt": "2021-04-05",
    "type": "FINANCIALS",
    "count": 8,
    "_links": {
      "file": "http://localhost:3010/financials/download/MPA-4C55165A593A/2021-04-05/REC-28CMIFE4OKYD.json"
    }
  }
  ```
- **404**:
  ```json
  {
    "statusCode": 404,
    "message": "Nothing found!"
  }
  ```