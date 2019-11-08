const {exec} = require('child_process');

var rootUri = require('path').resolve('./');

function buildTask() {
    console.log('building project from ', rootUri);
    // rebuild the projec
    return exec('nest build', {cwd: rootUri}, function(err, stdout, stderr){
        if (err == null) {
            if (!!stdout) {
                console.log(stdout);
            }
        } else {
            console.log(err);   
        }
        if (stderr) {
            console.log('stderr', stderr);
        }
    });
}

exports.build = buildTask