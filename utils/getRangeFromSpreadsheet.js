/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getRange } = require('./internal')

async function getRangeFromSpreadsheet(
	spreadsheetId,
	sheetName = 'Sheet1',
	startRow = 1,
	startColumn = 1,
	endRow = 100,
	endColumn = 100
) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	const headingsRow = await getHeadingsRow()

	const allData = await getRange(startRow + 1, startColumn, endRow + 1, endColumn)

	return allData.map(row => {
		const obj = {}
		for (let c = startColumn; c <= endColumn; c++) {
			obj[headingsRow[c - 1]] = row[c - startColumn]
		}
		return obj
	})
}

module.exports = getRangeFromSpreadsheet
