'use strict';

var gulp  = require('gulp');
var gutil = require('gulp-util');
var svg2sprite = require('gulp-svg-sprite');
var svg2png = require('gulp-svg2png');
var size = require('gulp-size');
var gulp = require('gulp');
var sass = require('gulp-sass');

var base = 'src/';

var uri = {
	src: {
		template: base + 'sass/_template.scss',
		svg: base + 'svg/*.svg',
		sass: base + 'sass/**/*.scss'
	},
	dst: {
		svg: 'sprite/sprite.svg',
		png: base + 'sprite/',
		map: 'sass/_map.scss',
		css: base + 'css/'
	}
}

gulp.task('svg-sprite', function () {
    return gulp.src(uri.src.svg)
        .pipe(svg2sprite({
            shape: {
                spacing: {
                    padding: 5
                }
            },
            mode: {
                css: {
                    dest: './',
                    layout: 'packed',
                    sprite: uri.dst.svg,
                    bust: false,
                    render: {
                        scss: {
                            dest: uri.dst.map,
                            template: uri.src.template
                        }
                    }
                }
            },
            variables: {
                mapname: 'icons'
            }
        }))
        .pipe(gulp.dest(base));
});

gulp.task('png-sprite', ['svg-sprite'], function() {
    return gulp.src(base + uri.dst.svg)
        .pipe(svg2png())
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(uri.dst.png));
});

gulp.task('sass', ['sprite'], function () {
  return gulp.src(uri.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(uri.dst.css));
});

gulp.task('watch', function () {
    gulp.watch(uri.src.sass, ['sprite', 'sass']);
});

gulp.task('sprite', ['png-sprite']);

gulp.task('default', ['sass']);
