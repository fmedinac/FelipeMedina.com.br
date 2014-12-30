var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css')
    server = require('tiny-lr')(),
    livereload = require('gulp-livereload'),
    sprite = require('css-sprite'),
    connect = require('gulp-connect');

gulp.task('styles', function() {
    gulp
        .src('./app/css/less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'app', 'assets', 'less')]
        }))
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./app/css'))
        .pipe(livereload(server));
});

gulp.task('connect', connect.server({
    root: __dirname + '/app',
    port: 9000,
    livereload: false
}));

gulp.task('sprites', function() {
    gulp.src('./app/img/ico/*.png')
        .pipe(sprite('sprites.png', {
            imagePath: '/img',
            cssPath: './app/css/less',
            prefix: '',
            preprocessor: 'less'
        }))
        .pipe(gulp.dest('./app/img'));
});

gulp.task('scripts', function() {
    gulp
        .src('./app/js/**/*.js')
        .pipe(livereload(server));
});

gulp.task('views', function() {
    gulp
        .src('./app/**/*.html')
        .pipe(livereload(server));
});

// The default task (called when you run `gulp`)
gulp.task('default',['connect'], function() {
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        gulp.watch('app/css/less/**/*.less', function() {
            gulp.run('styles');
        });
        gulp.watch('app/js/**/*.js', function() {
            gulp.run('scripts');
        });
        gulp.watch('app/html/**/*.html', function() {
            gulp.run('views');
        });
        gulp.watch('app/img/ico/*.png', function() {
            gulp.run('sprites');
        });
    });
});
