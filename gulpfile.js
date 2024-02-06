const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const webserver = require("gulp-webserver");

const styles = () => {
  return gulp
    .src("src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"));
};

const scripts = () => {
  return gulp
    .src("src/scripts/*.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
};

const images = () => {
  return gulp.src("src/img/*").pipe(gulp.dest("dist/img"));
};

const webserverTask = () => {
  return gulp.src("./").pipe(
    webserver({
      livereload: true,
      open: true,
    })
  );
};

const watch = () => {
  gulp.watch("src/styles/*.scss", styles);
  gulp.watch("src/scripts/*.js", scripts);
  gulp.watch("src/img/*", images);
};

gulp.task(
  "default",
  gulp.parallel(styles, scripts, images, webserverTask, watch)
);
