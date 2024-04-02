const { initialiseGoogleSheet, getHeadingsRow, getColumn, getRange } = require('./internal')

async function getAllRows(spreadsheetId, sheetName) {
	await initialiseGoogleSheet(spreadsheetId, sheetName)

	// Get the headings row
	const headingsRow = await getHeadingsRow()

	// Work out how many rows are in spreadsheet by fetching the first column
	const firstColValues = (await getColumn(0)).slice(1) // remove the first item as it will be the header row

	// Get all rows excluding the header row
	let rows = await getRange(2, 1, firstColValues.length + 1, headingsRow.length)

	// Convert each row (array of strings) to an object with keys from the headings row
	rows = rows.map(row => {
		const obj = {}
		headingsRow.forEach((key, i) => (obj[key] = row[i]))
		return obj
	})

	return rows
}

module.exports = getAllRows

if (require.main === module) {
	getAllRows('1YrY2Z5PaQ79SRDx_MK3wGGvm9YbYTnYpdZVqvWHlOyM', 'wikidefs')
}
