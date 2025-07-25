const core = require('@actions/core');
const github = require('@actions/github');
const {Toolkit} = require('actions-toolkit');
const showdown = require('showdown'),
    converter = new showdown.Converter({simplifiedAutoLink: true});
const https = require('https');
const url = require('url');
function escapeForJson(str) {
    return str
        .replace(/\\/g, '\\\\')  // Escape backslashes
        .replace(/"/g, '\\"')    // Escape straight double quotes
        .replace(/'/g, "\\'")    // Escape straight single quotes
        .replace(/“/g, '\\"')    // Escape left double quotation mark
        .replace(/”/g, '\\"')    // Escape right double quotation mark
        .replace(/‘/g, "\\'")    // Escape left single quotation mark
        .replace(/’/g, "\\'")    // Escape right single quotation mark
        .replace(/\r/g, '\\r');  // Escape carriage returns
}
Toolkit.run(async tools => {
    try {
        if (!tools.context.payload.ref) {
            tools.log.warn('Not a push skipping verification!');
            return;
        }
        const stripedLines = parseInt(core.getInput('strip_first_lines'));
        const ignoreNotes = core.getInput('no_notes') === 'true';
        const productId = process.env.PRODUCT_ID || '';
        const token = process.env.AUTH_TOKEN || '';
        let storeUrl = process.env.STORE_URL || '';
        const buildVersion = process.env.BUILD_VERSION || '';

        storeUrl = new URL(storeUrl);
        tools.log.debug('Starting commit verification!');
        let commitMessage = tools.context.payload.head_commit.message || '';
        if(ignoreNotes){
            commitMessage = '';
        }
        if (commitMessage.length !== 0) {
            tools.log.debug('No commit found!');
            commitMessage = commitMessage.split(/\r?\n/);
            commitMessage.splice(0, stripedLines);
            commitMessage = commitMessage.join("\n");
        }
        const data = JSON.stringify({
            "version": buildVersion, "id": productId, "body": escapeForJson(commitMessage), no_parsing: "yes"
        });
        const options = {
            hostname: storeUrl.hostname,
            path: '/wp-json/edd-so/v1/update_changelog/',
            headers: {
                'Cache-Control': 'no-cache',

                'Content-Length': data.length,
                'Content-Type': 'application/json',
                'x-themeisle-auth': token
            },

            method: 'POST',
        };
        const req = https.request(options, (res) => {
            let data = '';
            tools.log.debug('Status Code:', res.statusCode);
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                tools.log.debug('Body: ', JSON.parse(data));
            });

        }).on("error", (err) => {
            tools.log.debug("Error: ", err.message);
        });

        req.write(data);
        req.end();
    } catch (err) {
        const errorMessage = "Error verifying commit."
        tools.log.error(errorMessage)
        tools.log.error(err)

        if (err.errors) tools.log.error(err.errors)
        core.setFailed(errorMessage + '\n\n' + err.message)
        tools.exit.failure()
    }
}, {
    secrets: ['GITHUB_TOKEN']
});
