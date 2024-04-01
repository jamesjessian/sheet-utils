/* eslint-disable camelcase */

const { initialiseGoogleSheet, getHeadingsRow, getRange } = require('./internal')

const cache = {}

async function getRangeFromSpreadsheet(
	spreadsheetId,
	startRow = 1,
	startColumn = 1,
	endRow = 100,
	endColumn = 100,
	sheetName = 'Sheet1'
) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	// Get headings row
	const headingsRow = cache[spreadsheetId] || (await getHeadingsRow(spreadsheetId))
	cache[spreadsheetId] = headingsRow

	const allData = await getRange(startRow + 1, startColumn, endRow + 1, endColumn)

	const objs = []

	for (let r = 0; r < allData.length; r++) {
		const obj = {}
		for (let c = startColumn; c <= endColumn; c++) {
			obj[headingsRow[c - 1]] = allData[r][c - startColumn]
		}
		objs.push(obj)
	}
	return objs
}

module.exports = getRangeFromSpreadsheet

if (require.main === module) {
	getRangeFromSpreadsheet('1Gtx11n7hoLytdG6BhqrjkSLqULruO6GOpixsqNWFe5U', 10, 3, 85, 8)
		.then(result => {
			// Flatten the array of objects into one big array of values
			const flatMap = result.reduce((acc, row) => acc.concat(Object.values(row)), [])
			console.log(flatMap)
		})
		.catch(err => console.error(err))
		.then(() => process.exit())
}
