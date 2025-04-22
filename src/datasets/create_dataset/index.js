const core = require('@actions/core');
const get_palantir_vars = require("../../utils/get_palantir_vars.js");

async function createDataset() {
    let {token, hostname} = get_palantir_vars();
    const config = {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            parentFolderRid: core.getInput('parentFolderRid'),
            name: core.getInput('datasetName'),
        })
    }
    let response = await fetch(hostname + "/api/v2/datasets", config);
    switch (response.status) {
        case 200:
            let data = await response.json();
            core.setOutput('datasetRid', data.rid);
            core.setOutput('datasetName', data.name);
            core.setOutput('parentFolderRid', data.parentFolderRid);
            break;
        case 404:
            core.setFailed('404: Palantir host not found.');
            break;
        case 403:
            core.setFailed('403: Permission denied.');
            break;
        case 409:
            console.log("Dataset already created.");
            core.setOutput('datasetName', core.getInput('datasetName'));
            core.setOutput('parentFolderRid', core.getInput('parentFolderRid'));
            break;
        default:
            core.setFailed(`Unknown error, http code: ${response.status}`);
    }
}
createDataset();