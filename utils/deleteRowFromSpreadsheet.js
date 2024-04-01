/* eslint-disable camelcase */

const { initialiseGoogleSheet, deleteRow } = require('./internal')

async function deleteRowFromSpreadsheet(spreadsheetId, sheetName = 'Sheet1', rowIndex) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)
	await deleteRow(rowIndex)
}

module.exports = deleteRowFromSpreadsheet
