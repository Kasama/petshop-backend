const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourceMaps = require('gulp-sourcemaps');

const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const STATIC_FILES = ['src/public/**'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
	const tsResult = tsProject.src()
		.pipe(tsProject());
	return tsResult.js
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
	gulp.watch('src/**/*.ts', ['scripts']);
	gulp.watch('src/public/**', ['static']);
});

gulp.task('assets', function() {
	return gulp.src(JSON_FILES)
		.pipe(gulp.dest('dist'));
});

gulp.task('static', function() {
	return gulp.src(STATIC_FILES)
		.pipe(gulp.dest('dist/public'));
});

gulp.task('default', ['watch', 'assets', 'static']);
