const {src, dest, parallel} = require('gulp');

function moveAssetsTask() {
    console.log('this is move assets');
    return src(['./src/assets/**/*']).pipe(dest(['./dist/assets']))
}

function moveConfigTask() {
    console.log('this is move config');
    return src(['./src/config/**/*']).pipe(dest(['./dist/config']))
}

exports.move_assets = parallel(moveAssetsTask, moveConfigTask);