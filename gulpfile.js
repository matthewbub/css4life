const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

gulp.task('styles', function() {
	return gulp.src('src/*.css')
		.pipe(postcss([
			autoprefixer
		]))
		.pipe(gulp.dest('dist'));
});
