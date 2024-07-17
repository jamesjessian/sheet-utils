/* eslint-disable camelcase */

const { google } = require('googleapis')
const process = require('process')
const path = require('path')
const fs = require('fs')

const findUpModule = import('find-up')

const globals = {
	spreadsheetId: '',
	worksheetName: '',
	api: null,
}

async function initialiseGoogleSheet(spreadsheetId, worksheetName = 'Sheet1') {
	if (globals.spreadsheetId === spreadsheetId && globals.worksheetName === worksheetName) {
		return
	}

	let serviceAccount

	// If we have Google Service Account credentials in the environment variables, use these for authentication
	if (process.env.GOOGLE_SERVICE_ACCOUNT_TYPE) {
		const type = process.env.GOOGLE_SERVICE_ACCOUNT_TYPE
		const project_id = process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID
		const private_key_id = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID
		const private_key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
		const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL
		const client_id = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID
		const auth_uri = process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI
		const token_uri = process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI
		const auth_provider_x509_cert_url = process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL
		const client_x509_cert_url = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL

		// prettier-ignore
		serviceAccount = { type, project_id, private_key_id, private_key, client_email, client_id, auth_uri, token_uri, auth_provider_x509_cert_url, client_x509_cert_url, }
	} else {
		// Find the Google APIs service account key in the root directory of the project
		// The root directory is the one containing the package.json file or the one where the script is run from
		const f = await findUpModule
		const packageJsonPath = f.findUpSync('package.json')
		const rootDir = packageJsonPath ? path.dirname(packageJsonPath) : process.cwd()
		const serviceAccountKey = path.join(rootDir, 'google-service-account-key.json')

		if (!fs.existsSync(serviceAccountKey)) {
			console.error('Service account key not found at', serviceAccountKey)
			throw new Error('Service account key not found')
		}

		try {
			serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKey, 'utf8'))
		} catch (error) {
			console.log('Error reading service account key at', serviceAccountKey)
			throw new Error('Service account key invalid')
		}
	}

	const { client_email, private_key } = serviceAccount

	const pk = private_key.split('\\n').join('\n')
	const scopes = ['https://www.googleapis.com/auth/spreadsheets']
	const jwt = new google.auth.JWT(client_email, null, pk, scopes)

	globals.api = google.sheets({ version: 'v4', auth: jwt })

	globals.spreadsheetId = spreadsheetId
	globals.worksheetName = worksheetName
	globals.headings = await getRow(0)
}

function getRow(index) {
	const { worksheetName, spreadsheetId } = globals
	const range = `${worksheetName}!${index + 1}:${index + 1}`
	return globals.api.spreadsheets.values
		.get({ spreadsheetId, range })
		.then(result => (result.data.values ? result.data.values[0] : []))
		.catch(err => {
			return console.error(`Google Sheets API error: ${err}`)
		})
}

function getRange(r1, c1, r2, c2) {
	const { worksheetName, spreadsheetId } = globals
	const range = `${worksheetName}!R${r1}C${c1}:R${r2}C${c2}`
	return globals.api.spreadsheets.values
		.get({ spreadsheetId, range })
		.then(result => {
			return result.data.values
		})
		.catch(err => {
			return console.error(`Google Sheets API error: ${err}`)
		})
}

function getColLetter(index) {
	const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	if (index >= alpha.length) {
		return alpha[Math.floor(index / alpha.length) - 1] + alpha[index % alpha.length]
	}
	return alpha[index]
}

function getHeadingsRow() {
	return globals.headings
}

function getColumn(index) {
	const { worksheetName, spreadsheetId } = globals
	const colId = getColLetter(index)
	return globals.api.spreadsheets.values
		.get({ spreadsheetId, range: `${worksheetName}!${colId}:${colId}` })
		.then(result => {
			return (result.data.values || []).map(row => row[0])
		})
		.catch(err => {
			return console.error(`Google Sheets API error: ${err}`)
		})
}

function writeRow(values, rowIndex) {
	const rows = [values]
	const { worksheetName, spreadsheetId } = globals
	const resource = { values: rows }
	// Enter values as if user had typed them in
	const valueInputOption = 'USER_ENTERED'
	const range = `${worksheetName}!${getColLetter(0)}${rowIndex + 1}:${getColLetter(values.length - 1)}${rowIndex + 1}`

	return globals.api.spreadsheets.values
		.update({ spreadsheetId, range, valueInputOption, resource })
		.then(result => {
			console.log('result', result)
			const cellsUpdated = (result.data || {}).updatedCells
			console.log(`${cellsUpdated} cells updated in Google Sheet ${spreadsheetId}`)
			return cellsUpdated
		})
		.catch(err => {
			return console.error(`Google Sheets API error: ${err}`)
		})
}

async function deleteRow(rowIndex) {
	const { worksheetName, spreadsheetId } = globals

	// Firstly we need to get the worksheet ID, based on the given worksheet name
	let sheetId
	try {
		const request = { spreadsheetId, ranges: [worksheetName], includeGridData: false }
		const res = await globals.api.spreadsheets.get(request)
		sheetId = res.data.sheets[0].properties.sheetId
	} catch (err) {
		return console.error(`Google Sheets API error: ${err}`)
	}

	const range = { sheetId, startRowIndex: rowIndex, endRowIndex: rowIndex + 1 }
	const resource = {
		requests: [{ deleteRange: { range, shiftDimension: 'ROWS' } }],
	}

	return globals.api.spreadsheets.batchUpdate({ spreadsheetId, resource })
}

module.exports = {
	initialiseGoogleSheet,
	getRow,
	writeRow,
	getColumn,
	getHeadingsRow,
	getRange,
	deleteRow,
}
