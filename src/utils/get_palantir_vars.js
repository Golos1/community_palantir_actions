const core = require('@actions/core');
/**
 * Utility function that actions can use to get the strings for palantir instance hostname and foundry api token.
 *Throws a Reference Error if one of these credentials is neither supplied as an input nor an environment variable.
 *  @returns {{token: string, hostname: string}}
 */
module.exports = function(){
    let token = core.getInput('foundry_token');
    let hostname = core.getInput('palantir_hostname');
    if(token === ""){
        if(process.env.FOUNDRY_TOKEN){
            token = process.env.FOUNDRY_TOKEN;
            if(!token.startsWith("Bearer ")){
                token = "Bearer " + token;
            }
        }
        else{
            throw new ReferenceError("Foundry Token not detected. Please either supply as input to the action or set the FOUNDRY_TOKEN environment variable.")
        }
    }
    if(hostname === ""){
        if(process.env.PALANTIR_HOSTNAME){
            hostname = process.env.PALANTIR_HOSTNAME;
        }
        else{
            throw new ReferenceError("Palantir hostname not detected. Please either supply as input to the action or set the PALANTIR_HOSTNAME environment variable.")
        }
    }
    if(!hostname.startsWith("https://")){
        hostname = "https://" + hostname
    }
    return {'token': token, 'hostname': hostname};
}