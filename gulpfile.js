var gulp = require("gulp");
var webpack = require("gulp-webpack");
var ts = require("gulp-typescript");
var del = require("del");
var sequence = require("run-sequence");
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');
var path = require("path");

gulp.task("compile", function () {
    return gulp.src('src/**/*')
               .pipe(webpack(require('./webpack.config.js')))
               .pipe(gulp.dest("lib"))
});

gulp.task("clean", function() {
    return del(['lib']);
});

gulp.task("copy-resources", function() {
    return gulp.src(['src/**/!(*.ts)'])
               .pipe(gulp.dest('lib'));
});

gulp.task("default", function(done) {
    sequence('clean', 'compile', 'copy-resources', done);
});
