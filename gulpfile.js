const
	gulp       = require('gulp'),
	clean      = require('gulp-clean'),
	header     = require('gulp-header'),
	rename     = require('gulp-rename'),
	babel      = require('gulp-babel'),
	uglifyes   = require('uglify-es'),
	composer   = require('gulp-uglify/composer'),
	uglify     = composer(uglifyes, console),
	sequence   = require('run-sequence');

const
	DIR_SRC  = 'src/',
	DIR_DIST = 'dist/';

const
	package = require('./package.json'),
	banner  = [
		'/*',
		'	-------------------------------------------------------------------',
		'	<%= pkg.name %>',
		'	<%= pkg.description %>',
		'',
		'	@version v<%= pkg.version %>',
		'	@link <%= pkg.homepage %>',
		'	@license <%= pkg.license %> : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE',
		'	-------------------------------------------------------------------',
		'*/',
		'',
		''
	  ].join('\n');

const errorHandler = name => {
	return err => {
		console.error('Error from ' + name + ' in compress task', err.toString());
	};
}

gulp.task('clean', () => {
	return gulp
		.src( DIR_DIST )
		.pipe( clean( {read: false} ) );
});

gulp.task('es6', () => {
	return gulp
		.src( DIR_SRC + '*.js' )
		.pipe( header(banner, {pkg : package}) )
		.pipe( rename({ suffix: '.es6' }) )
		.pipe( gulp.dest(DIR_DIST) )
		.pipe( rename({ suffix: '.min' }) )
		.pipe( uglify() )
		.pipe( gulp.dest(DIR_DIST) );
});

gulp.task('es5', () => {
	return gulp
		.src( DIR_SRC + '*.js' )
		.pipe( babel( {presets: ['env']} ) )
		.pipe( header(banner, {pkg : package}) )
		.pipe( gulp.dest(DIR_DIST) )
		.pipe( rename({ suffix: '.min' }) )
		.pipe( uglify() )
		.pipe( gulp.dest(DIR_DIST) );
});


gulp.task('default', () => {
	sequence('clean', ['es6', 'es5']);
});
