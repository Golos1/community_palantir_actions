const core = require('@actions/core');
const get_palantir_vars = require("../../utils/get_palantir_vars.js");

async function createBranch() {
    let {token, hostname} = get_palantir_vars();
    let body;
    if(core.getInput("transactionRid")===""){
        body = JSON.stringify({
            name: core.getInput('branchName'),
        })
    }
    else{
        body = JSON.stringify({
            name: core.getInput('branchName'),
            transactionRid: core.getInput('transactionRid'),
        })
    }
    const config = {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: body
    }
    let response = await fetch(hostname + "/api/v2/datasets/" + core.getInput("datasetRid") + "/branches", config);
    switch (response.status) {
        case 200:
            let data = await response.json();
            core.setOutput('branchName', data['branchName']);
            if("transactionRid" in  data){
                core.setOutput('transactionRid', data['transactionRid']);
            }
            break;
        case 403:
            core.setFailed('403: Permission denied.');
            break;
        case 404:
            core.setFailed('404: Not Found.');
            break;
        case 409:
            console.log("Branch already exists.");
            core.setOutput('branchName', core.getInput("branchName"));
            if(core.getInput("transactionRid")!==""){
                core.setOutput('transactionRid', core.getInput("transactionRid"));
            }
            break;
        default:
            core.setFailed(`Unknown error, http code: ${response.status}`);
            break;
    }
}
createBranch();