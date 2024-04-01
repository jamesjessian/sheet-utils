/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getRow: getRowInternal } = require('./internal')

async function getRow(spreadsheetId, sheetName, rowIndex = null) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	const headingsRow = await getHeadingsRow()

	const dataRow = await getRowInternal(rowIndex)

	const obj = {}
	headingsRow.forEach((key, i) => (obj[key] = dataRow[i]))

	return obj
}

module.exports = getRow
