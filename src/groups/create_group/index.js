const get_palantir_vars = require("../../utils/get_palantir_vars");
const core = require("@actions/core");

async function createBranch() {
    let {token, hostname} = get_palantir_vars();
    const config = {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            name: core.getInput('group_name'),
            organizations: core.getInput('org_list').split(' '),
            description: core.getInput('group_description'),
        })
    }
    let response = await fetch(hostname + "/api/v2/admin/groups", config);
    let data = await response.json();
    switch (response.status) {
        case 400:
            core.setFailed('400: Group already exists or lacks a valid organization RID.');
            break;
        case 200:
            core.setOutput('group_rid', data.id);
            break;
        case 404:
            core.setFailed('404: Organization not found.');
            break;
        case 403:
            core.setFailed('403: Permission denied.');
            break;
        default:
            core.setFailed(`Unknown error, http code: ${response.status}`);
    }
}
createBranch();