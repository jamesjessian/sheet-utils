/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getRow } = require('./internal')

const cache = {}

async function getRowFromSpreadsheet(spreadsheetId, rowIndex = null, sheetName = 'Sheet1') {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	// Get headings row
	const headingsRow = cache[spreadsheetId] || (await getHeadingsRow(spreadsheetId))
	cache[spreadsheetId] = headingsRow

	const dataRow = cache[spreadsheetId + rowIndex] || (await getRow(rowIndex))
	const obj = {}

	headingsRow.forEach((key, i) => (obj[key] = dataRow[i]))

	return obj
}

module.exports = getRowFromSpreadsheet

if (require.main === module) {
	getRowFromSpreadsheet('1Gtx11n7hoLytdG6BhqrjkSLqULruO6GOpixsqNWFe5U', 10)
		.then(result => console.log(result))
		.catch(err => console.error(err))
		.then(() => process.exit())
}
