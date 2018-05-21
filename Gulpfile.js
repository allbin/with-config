let gulp = require('gulp');
let del = require('del');
let bump = require('gulp-bump');
let eslint = require('gulp-eslint');
let babel = require('gulp-babel');
let exec = require('child_process').exec;
let fs = require('fs');

let execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(new Error(cmd + ": " + stderr));
            }
            return resolve();
        });
    });
};

let paths = {
    scripts: ['src/**/*.js', 'src/**/*.jsx']
};


// ---- preparations ----
gulp.task('clean', () => {
    return del(['build', 'dist']);
});

gulp.task('lint', () => {
    return gulp.src(paths.scripts)
        .pipe(eslint({ configFile: "./.eslintrc.js" }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// ---- build ----
gulp.task('build:prep', ['clean', 'lint']);

gulp.task('build', ['build:prep'], () => {
    return gulp.src(paths.scripts)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('bump', (cb) => {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('.'));
});
gulp.task('bump:minor', (cb) => {
    return gulp.src('./package.json')
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('.'));
});
gulp.task('bump:major', (cb) => {
    return gulp.src('./package.json')
        .pipe(bump({type: 'major'}))
        .pipe(gulp.dest('.'));
});


function pushBumpAndTag(cb) {
    try {
        let pkg = JSON.parse(fs.readFileSync('package.json'));

        Promise.resolve()
            .then(() => { return execPromise('git add package.json dist'); })
            .then(() => { return execPromise('git commit -m "Release v' + pkg.version + '"'); })
            .then(() => { return execPromise('git tag v' + pkg.version); })
            .then(() => { return execPromise('git push && git push --tags'); })
            .then(() => { return cb(); });

    } catch (err) {
        return cb(err);
    }
}

gulp.task('release', ['bump', 'build'], (cb) => {
    pushBumpAndTag(cb);
});
gulp.task('release:minor', ['bump:minor', 'build'], (cb) => {
    pushBumpAndTag(cb);
});
gulp.task('release:major', ['bump:major', 'build'], (cb) => {
    pushBumpAndTag(cb);
});

gulp.task('default', ['build']);
