/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getColumn, writeRow } = require('./internal')

const cache = {}

async function addRowToSpreadsheet(spreadsheetId, rowData, sheetName = 'Sheet1', rowIndex = null) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	// Get headings row
	const headingsRow = cache[spreadsheetId] || (await getHeadingsRow(spreadsheetId))
	cache[spreadsheetId] = headingsRow

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
