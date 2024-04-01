/* eslint-disable camelcase */

const { initialiseGoogleSheet, deleteRow: deleteRowInternal } = require('./internal')

async function deleteRow(spreadsheetId, sheetName = 'Sheet1', rowIndex) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)
	await deleteRowInternal(rowIndex)
}

module.exports = deleteRow
