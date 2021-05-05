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

//BODY PARSER - EXPRESS LIDAR LIDAR COM REQUISIÇÕES URLENCODED, FACILITAR O ENVIO DE ARQUIVOS
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
//BODY PARSER - EXPRESS LIDAR COM REQUISIÇÕES FORMATO JSON
app.use(bodyParser.json({ limit: '50mb' }));

const doc = new GoogleSpreadsheet('1jVDqLQw3-3mQ4BB59cE7_kW07qInQsjQVCekdeNPa8A');

app.get('/', async (req, res) => {
	try {
		await doc.useServiceAccountAuth(require('./credentials/google-sheets-api.json'));
		await doc.loadInfo(); // Carrega as infos da planilha

		const sheet = doc.sheetsByIndex[0];

		let limit = { limit: 50 };

		const rows = await sheet.getRows();

		let lastRow = rows.length;

		console.log({ totalPreenchidas: lastRow });

		//console.log(rows)

		const dados = rows
			.map(({ ID, imagem, nome }) => {
				return {
					ID,
					imagem,
					nome
				};
			})//.filter((item) => item.nome.includes(ID));


		lRow = dados.length;
		console.log({ filtrados: lRow });
		res.status(200).json(dados);
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

app.get('/user/:id', async (req, res) => {
	try {
		await doc.useServiceAccountAuth(require('./credentials/google-sheets-api.json'));
		await doc.loadInfo(); // Carrega as infos da planilha

		const sheet = doc.sheetsByIndex[0];

		let limit = { limit: 50 };

		let ID = req.params.id;

		const rows = await sheet.getRows();

		let lastRow = rows.length;

		console.log({ totalPreenchidas: lastRow });

		//console.log(rows)

		const dados = rows
			.map(({ ID, imagem, nome }) => {
				return {
					ID,
					imagem,
					nome
				};
			})
			.filter((item) => item.ID === ID);

		lRow = dados.length;
		console.log({ filtrados: lRow });
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
