/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getRow } = require('./internal')

async function getRowFromSpreadsheet(spreadsheetId, sheetName, rowIndex = null) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	const headingsRow = await getHeadingsRow()

	const dataRow = await getRow(rowIndex)

	const obj = {}
	headingsRow.forEach((key, i) => (obj[key] = dataRow[i]))

	return obj
}

module.exports = getRowFromSpreadsheet
