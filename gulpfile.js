
const autoprefixer = require('autoprefixer')
const cssnano = require('gulp-cssnano')
const gulp = require('gulp')
const moduleImporter = require('sass-module-importer')
const notify = require('gulp-notify')
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const paths = {
  src: {
    scss: {
      site: [
        'src/scss/**/*.scss'
      ]
    }
  },
  dest: {
    css: 'web/assets/build/css/',
  }
}

function handleErrors () {
  let args = Array.prototype.slice.call(arguments)

  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args)

  this.emit('end') // Keep gulp from hanging on this task
}

gulp.task('css', function () {
  // Sass options
  const options = {
    style: 'compact',
    noCache: true,
    importer: moduleImporter()
  }

  // PostCSS plugins
  const processors = [
    autoprefixer() // browser list is defined in package.json 'browserslist'
  ]

  return gulp.src(paths.src.scss.site)
    .pipe(sourcemaps.init())
      // .pipe(scsslint({'config': '.scss-lint.yml'}))
      .pipe(sass(options).on('error', handleErrors))
      .pipe(postcss(processors))
      .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.css))
})

gulp.task('default', ['css'], function () {
  gulp.watch(paths.src.scss.site, ['css'])
})
