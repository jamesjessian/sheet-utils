/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getColumn, writeRow } = require('./internal')

async function addRowToSpreadsheet(spreadsheetId, sheetName, rowData, rowIndex = null) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	const headingsRow = await getHeadingsRow()

	const dataForRow = []
	Object.keys(rowData).forEach(key => {
		dataForRow[headingsRow.indexOf(key)] = rowData[key]
	})
	let _rowIndex = rowIndex
	if (rowIndex === null) {
		const col = await getColumn(0)
		_rowIndex = col.length
	}
	await writeRow(dataForRow, _rowIndex)
}

module.exports = addRowToSpreadsheet
