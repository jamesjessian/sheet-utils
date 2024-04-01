const { getColumn, initialiseGoogleSheet, getHeadingsRow } = require('./internal')

async function getColumnByNameFromSpreadsheet(spreadsheetId, sheetName, columnName) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	const headingsRow = await getHeadingsRow()

	const colIndex = headingsRow.indexOf(columnName)
	if (colIndex === -1) {
		console.error(`Column ${columnName} not found in sheet ${sheetName}`)
		return []
	}

	return getColumn(colIndex)
}

module.exports = getColumnByNameFromSpreadsheet
