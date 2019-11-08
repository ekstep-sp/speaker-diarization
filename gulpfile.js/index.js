const {series} = require('gulp');
const {build} = require('./gulp-tasks/task_build');
const {move_assets} = require('./gulp-tasks/task_move-assets');


exports.default = series(build,move_assets);