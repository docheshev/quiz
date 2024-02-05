const gulp = require("gulp");

//HTML
const fileInclude = require("gulp-file-include");
const webpHTML = require("gulp-webp-html");
const htmlclean = require("gulp-htmlclean");

//SCSS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const webpCss = require("gulp-webp-css");

const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const fs = require("fs");
const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const changed = require("gulp-changed");

//IMAGES
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html:docs", function () {
  return (
    gulp
      .src(["./src/html/**/*.html", "!./src/html/blocks/**/*.html"])
      .pipe(changed("./docs/"))
      .pipe(fileInclude(fileIncludeSettings))
      .pipe(htmlclean())
      .pipe(webpHTML())
      .pipe(gulp.dest("./docs/"))
      .pipe(browserSync.stream())
  );
});

gulp.task("sass:docs", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(changed("./docs/css/"))
      .pipe(autoprefixer())
      .pipe(sassGlob())
      .pipe(groupMedia())
      .pipe(sass())
      .pipe(csso())
      .pipe(webpCss())
      .pipe(gulp.dest("./docs/css/"))
      .pipe(browserSync.stream())
  );
});

gulp.task("images:docs", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./docs/img/"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/img/"))
    .pipe(gulp.src("./src/img/**/*"))
    .pipe(changed("./docs/img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

gulp.task("js:docs", function () {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./docs/js/"))
      .pipe(babel())
      .pipe(webpack(require("../webpack.config.js")))
      .pipe(gulp.dest("./docs/js/"))
      .pipe(browserSync.stream())
  );
});

gulp.task("json:docs", function () {
  return gulp
    .src("./src/js/*.json")
    .pipe(changed("./docs/js/"))
    .pipe(gulp.dest("./docs/js/"));
});

gulp.task("server:docs", function watching() {
  browserSync.init({
    server: {
      baseDir: "./docs/",
    },
  });
});

gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});