require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const app = express();

app.use(cors());

//Usuarios
const userRoute = require('./routes/user-route');
const { search } = require('./routes/user-route');

//BODY PARSER - EXPRESS LIDAR LIDAR COM REQUISIÇÕES URLENCODED, FACILITAR O ENVIO DE ARQUIVOS
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
);
//BODY PARSER - EXPRESS LIDAR COM REQUISIÇÕES FORMATO JSON
app.use(bodyParser.json({ limit: '50mb' }));

const doc = new GoogleSpreadsheet(
  '1jVDqLQw3-3mQ4BB59cE7_kW07qInQsjQVCekdeNPa8A'
);

app.get('/', async (req, res) => {
  try {
    await doc.useServiceAccountAuth(
      require('./credentials/google-sheets-api.json')
    );
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[0];

    //Total de registros no banco
    let total = sheet.rowCount;

    //let limit = { limit: 50 };

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.per_page) || 10;
    let search = req.query.search;

    const rows = await sheet.getRows({
      offset: page * limit - limit,
      limit: limit,
      ID: search
    });

    let lastRow = rows.length - 1;

    console.log({ totalPreenchidas: lastRow });

    //console.log(rows)

    const dados = rows.map(
      ({ ID, imagem, nome, rowNumber }) => {
        return {
          ID,
          imagem,
          nome,
          rowNumber
        };
      }
    ); //.filter((item) => item.nome.toLowerCase().includes(search.toLowerCase()));

    lRow = dados.length;
    //console.log({ filtrados: lRow, dados });
    console.log({ Total: total });
    res.status(200).json(dados);
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

app.get('/teste', async (req, res) => {
  try {
    await doc.useServiceAccountAuth(
      require('./credentials/google-sheets-api.json')
    );
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[0];

    //Total de registros no banco
    let total = sheet.rowCount;

    //let limit = { limit: 50 };

    //let page = Number(req.query.page) || 1;
    //let limit = Number(req.query.per_page) || total;
    //let search = req.query.search || '';

    if (!req.query.page) {
      var page = 1;
    } else {
      var page = Number(req.query.page);
    }

    if (!req.query.per_page) {
      var limit = total - 1;
    } else {
      var limit = Number(req.query.per_page);
    }

    if (!req.query.search) {
      var search = '';
    } else {
      var search = req.query.search;
      var limit = total - 1;
      var page = 1;
    }

    const rows = await sheet.getRows({
      // limit: limit,
      // offset: page * limit - limit
    });
    const test = [...rows];
    let lastRow = rows.length - 1;

    console.log({ totalPreenchidas: lastRow });
    console.log({ Total: total });

    //console.log(rows)

    const dados = rows
      .map(({ ID, imagem, nome, rowNumber, slug }) => {
        return {
          ID,
          imagem,
          nome,
          slug,
          rowNumber
        };
      })
      .filter((item) =>
        item.nome
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    lRow = dados.length;
    console.log({ filtrados: lRow });
    console.log({ Total: total });
    res.status(200).json(dados);
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

app.get('/app', async (req, res) => {
  try {
    await doc.useServiceAccountAuth(
      require('./credentials/google-sheets-api.json')
    );
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[0];

    //Total de registros no banco
    let total = Number(sheet.rowCount-1);

    //let limit = { limit: 50 };

    var page = Number(req.query.page) || 1;
    var limit = Number(req.query.per_page) || total;
    if (req.query.search) {
      var search = req.query.search;
      var limit = total;
      var page = 1;  
    } else {
      var search = '';
    }

/*     if (!req.query.page) {
      var page = 1;
    } else {
      var page = Number(req.query.page);
    }

    if (!req.query.per_page) {
      var limit = total - 1;
    } else {
      var limit = Number(req.query.per_page);
    }

    if (!req.query.search) {
      var search = '';
    } else {
      var search = req.query.search;
      var limit = total - 1;
      var page = 1;
    } */

    const rows = await sheet.getRows({
      limit: limit,
      offset: page * limit - limit,
    });
    const test = [...rows];
    let lastRow = rows.length;

    console.log({ totalPreenchidas: lastRow });
    console.log({ Total: total });

    //console.log(rows)

    const dados = rows
      .map(({ ID, imagem, nome, rowNumber, slug }) => {
        return {
          ID,
          imagem,
          nome,
          slug,
          rowNumber
        };
      })
      .filter((item) =>
        item.nome
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    lRow = dados.length;
    console.log({ filtrados: lRow });
    console.log({ Total: total });
    res.status(200).json(dados);
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

app.get('/user/:id?', async (req, res) => {
  try {
    await doc.useServiceAccountAuth(
      require('./credentials/google-sheets-api.json')
    );
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[0];

    let limit = { limit: 50 };

    let ID = +req.params.id;

    const rows = await sheet.getRows();

    const test = [...rows];

    const dados = rows
      .map(({ ID, imagem, nome, rowNumber, slug }) => {
        return {
          ID,
          imagem,
          nome,
          slug,
          rowNumber
        };
      })
      .filter((item) => +item.ID === +ID)
      .reduce((acc, item) => {
        +item.ID === +ID;
      });

    res.status(200).json(dados);
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

//Usuarios
app.use('/users', userRoute);

//Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Servidor rodando!');
});
