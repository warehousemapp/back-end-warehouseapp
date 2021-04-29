const { GoogleSpreadsheet } = require('google-spreadsheet');
const {promisify} = require ("util")

const doc = new GoogleSpreadsheet('1jVDqLQw3-3mQ4BB59cE7_kW07qInQsjQVCekdeNPa8A');

exports.create = async (req, res) => {
  try {
    const { ID, nome } = req.body;
    await doc.useServiceAccountAuth(require('../credentials/google-sheets-api.json'));
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();

    let lastRow = rows.length + 1;

    await sheet.addRows([
      { ID, nome }
    ]);

    return res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ success: false })
  }
};

exports.ready = async (req, res) => {
  try {
    await doc.useServiceAccountAuth(require('../credentials/google-sheets-api.json'));
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[1];

    let limit = { limit: 50 };

    let id = req.params.id;

    const rows = await sheet.getRows();

    let lastRow = rows.length + 1;

    let total = await sheet.rowCount;

    console.log(total, lastRow);
    console.log(rows)

    const users = rows.map(({ idUsers, image, name, username, email, password, createdAt, updatedAt, active, rowNumber}) => {
      return {
        idUsers,
        image,
        name,
        username,
        email,
        password,
        createdAt,
        updatedAt,
        active,
        rowNumber,
      };
    });
    
    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ success: false })
  }
};

exports.search2 = async (req, res) => {

  try {
    await doc.useServiceAccountAuth(require('../credentials/google-sheets-api.json'));
    await doc.loadInfo(); // Carrega as infos da planilha

    const sheet = doc.sheetsByIndex[1];

    let limit = { limit: 50 };

    let idUsers = req.params.id;

    const rows = await(sheet.getRows)();

    let lastRow = rows.length + 1;

    let total = await sheet.rowCount;

    console.log(total, lastRow);
    console.log(rows)

    const users = rows.map(({ idUsers, image, name, username, email, password, createdAt, updatedAt, active, rowNumber}) => {
      return {
        idUsers,
        image,
        name,
        username,
        email,
        password,
        createdAt,
        updatedAt,
        active,
        rowNumber,
      };
    });
    
    console.log(rows.find(idUsers=1))
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ success: false })
  }
};