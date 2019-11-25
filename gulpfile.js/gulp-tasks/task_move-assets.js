const {src, dest, parallel} = require('gulp');

function moveAssetsTask() {
    console.log('moving assets');
    return src(['./src/assets/**/*']).pipe(dest(['./dist/assets']))
}

function moveConfigTask() {
    console.log('moving configurations for the project');
    return src(['./src/config/**/*']).pipe(dest(['./dist/config']))
}

exports.move_assets = parallel(moveAssetsTask, moveConfigTask);