'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

const dirs = {
  src: 'src/',
  dest: 'dist/'
}



// Copy html
gulp.task('copyHtml', () => {
    gulp.src(dirs.src+'*.html')
    .pipe(gulp.dest(dirs.dest))
})



// Compile and concatenate es6 to regular old javascript
gulp.task('buildJs', () => {
	return gulp.src(dirs.src+'js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread']
		}))
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dirs.dest+'js'))
})



// Set up local server from in dist directory
gulp.task('serve', () => {
	browserSync.init({
		open: false,
		server: {
			baseDir: dirs.dest
		}
	})
})



// Default tasks
gulp.task('default', ['copyHtml','buildJs','serve'], () => {
	gulp.watch(dirs.src+'js/**/*.js', ['buildJs'])
	gulp.watch(dirs.src+'*.html', ['copyHtml'])
	gulp.watch([dirs.dest+'**/*.*']).on('change', browserSync.reload)
})








