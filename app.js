require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");





//Usuarios
const userRoute = require("./routes/user-route");

var cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const urlencoder=bodyParser.urlencoded({extended:false});
const app=express();


app.get("/", async (req, res) => {
  try {
    await doc.useServiceAccountAuth(require('./credentials/google-sheets-api.json'));

    await doc.loadInfo(); // Carrega as infos da planilha

    console.log('Titulo da planilha', doc.title);

    const sheet = doc.sheetsByIndex[0];

    let limit = { limit: 50 };

    const rows = await sheet.getRows();

    let lastRow = rows.length + 1;

    let total = await sheet.rowCount;

    console.log(total, lastRow);

    const dados = rows.map(({ ID, imagem, nome }) => {
      return {
        ID,
        imagem,
        nome
      };
    });
    res.status(200).json({dados});
  } catch (error) {
    res.status(400).json({ success: false })
  }
});

//Usuarios
app.use("/users", userRoute);

//Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Servidor rodando!");
});