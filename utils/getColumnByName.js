const { getColumn, initialiseGoogleSheet, getHeadingsRow } = require('./internal')

async function getColumnByName(spreadsheetId, sheetName, columnName) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	const headingsRow = await getHeadingsRow()

	const colIndex = headingsRow.indexOf(columnName)
	if (colIndex === -1) {
		console.error(`Column ${columnName} not found in sheet ${sheetName}`)
		return []
	}

	const column = await getColumn(colIndex)

	// Remove the first item from the column, as that will be the heading
	column.shift()

	return column
}

module.exports = getColumnByName
