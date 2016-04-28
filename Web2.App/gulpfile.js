"use strict";
var gulp = require("gulp");  
var del = require("del");  
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json', { out: './app/main.js'});
/**
 * Remove build directory.
 */
gulp.task('clean', function (cb) {  
    return del(["build"], cb);
});

gulp.task( 'compile', ["assets", "libs"], function() {
    var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

    return tsResult.js
            .pipe(sourcemaps.write('.')) 
            .pipe(gulp.dest('build'));
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", ["server", /*"app",*/ "assets"], function () {  
    console.log("Building resources...");
});

gulp.task("app", function(){  
    return gulp.src(["app/**", "!app/**/*.ts", /*!app/**",*/ "index.html"], { base : "."})
        .pipe(gulp.dest("build"));
})

gulp.task("server", function () {  
    return gulp.src(["index.js", "package.json"], { cwd: "server/**" })
        .pipe(gulp.dest("build"));
});

gulp.task("assets", function(){  
    return gulp.src(["index.html", "styles.css"])
        .pipe(gulp.dest("build"));
});
/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", function () {  
    return gulp.src([
        'es6-shim/es6-shim.min.js',
        'systemjs/dist/system-polyfills.js',
        'angular2/bundles/angular2-polyfills.js',
        'angular2/es6/dev/src/testing/shims_for_IE.js',
        'systemjs/dist/system.src.js',
        'rxjs/bundles/Rx.js',
        'angular2/bundles/angular2.dev.js',
        'angular2/bundles/router.dev.js'
    ], { cwd: "node_modules/**" }) /* Glob required here. */
        .pipe(gulp.dest("build/node_modules"));
});
/**
 * Build the project.
 */
gulp.task("default", ['compile', 'resources', 'libs'], function () {  
    console.log("Building the project ...");
});