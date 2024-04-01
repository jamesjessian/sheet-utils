/* eslint-disable camelcase */

const { initialiseGoogleSheet, deleteRow } = require('./internal')

async function deleteRowFromSpreadsheet(spreadsheetId, rowIndex, sheetName = 'Sheet1') {
	await initialiseGoogleSheet(spreadsheetId, sheetName)
	await deleteRow(rowIndex)
}

module.exports = deleteRowFromSpreadsheet

if (require.main === module) {
	// deleteRowFromSpreadsheet('1jGETfXauZBTT1sZ6I4NhgFPaqet2pT0uuVyojoCHk9E', 44)
	deleteRowFromSpreadsheet('1YrY2Z5PaQ79SRDx_MK3wGGvm9YbYTnYpdZVqvWHlOyM', 44, 'wikidefs')
		.then(result => console.log(result))
		.catch(err => console.error(err))
		.then(() => process.exit())
}
