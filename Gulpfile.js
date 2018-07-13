let del = require('del');
let gulp = require('gulp4');
let allbin = require('gulp-allbin');
let tslint = require('gulp-tslint');

let sourcemaps = require('gulp-sourcemaps');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('./tsconfig.json');

function lint() {
    return gulp.src(['src/**/*.ts', 'src/**/*.tsx'])
        .pipe(tslint({
            fomatter: "json",
            configuration: "./tslint.json"
        }))
        .pipe(tslint.report());
}


gulp.task('clean', () => {
    return del(['build', 'dist']);
});

gulp.task('build', function () {
    return lint().pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});



gulp.task('release:patch', gulp.series("clean", "build", allbin.tagAndPush(["package.json", "dist"], "patch")));
gulp.task('release:minor', gulp.series("clean", "build", allbin.tagAndPush(["package.json", "dist"], "minor")));
gulp.task('release:major', gulp.series("clean", "build", allbin.tagAndPush(["package.json", "dist"], "major")));