const { GoogleSpreadsheet } = require ('google-spreadsheet');

const doc = new GoogleSpreadsheet('1jVDqLQw3-3mQ4BB59cE7_kW07qInQsjQVCekdeNPa8A');

exports.create=async (req, res) => {
  try {
    const { ID,nome } = req.body;
    await doc.useServiceAccountAuth(require('../credentials/google-sheets-api.json'));
    await doc.loadInfo(); // Carrega as infos da planilha

          const sheet = doc.sheetsByIndex[0];
  
          const rows = await sheet.getRows();
  
          let lastRow = rows.length + 1;

          await sheet.addRows([
            {ID,nome}
          ]);
  
    return res.status(201).json({ ok: true });
  } catch (err) {
    res.status(400).json({ success: false })
  }
};