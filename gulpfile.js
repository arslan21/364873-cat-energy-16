"use strict";

var gulp = require("gulp");
var del = require("del");

var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");

var imagemin = require("gulp-imagemin");

var webp = require("gulp-webp");

var uglify = require("gulp-uglify");

var svgstore = require("gulp-svgstore");
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');

var inject = require('gulp-inject');

var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    // .pipe(rename("style-min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"))
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quaality:90}))
    .pipe(gulp.dest("build/img"))
});

gulp.task("uglify", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
});

gulp.task("server", function () {
  server.init({
    server: "build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("build"));
  gulp.watch("source/*.html", gulp.series("build"));
  gulp.watch("source/img/**/*", gulp.series("build"));
  gulp.watch("source/js/**/*", gulp.series("build"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.{ico,png}",
    "source/*.json",
    "source/*.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build/");
});

gulp.task("sprite", function () {
  var svgs = gulp.src("source/img/icon-*.svg")
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('style').remove();
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(replace('\n', ''))
    // .pipe(replace('></svg>', '>\n</svg>'))
    .pipe(svgstore ({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"));
  function fileContents (filePath, file) {
    return file.contents.toString();
  }
  return gulp.src('source/*.html')
    .pipe(inject(svgs, {
      starttag: '<!-- inject:svg --> ',
      transform: fileContents }))
    .pipe(gulp.dest("source"));
});

gulp.task("build", gulp.series("clean", "uglify", "css", "copy"));
gulp.task("start", gulp.series("build", "server"));
gulp.task("imagesopimize", gulp.series("images", "webp"));
