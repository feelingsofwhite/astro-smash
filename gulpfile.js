var gulp = require('gulp');
//var console = require('console');
//var del = require('del');
var connect = require('gulp-connect');
var open = require('open');
var chalk = require('chalk');
//var less = require('gulp-less');
//var path = require('path');
//var sourcemaps = require('gulp-sourcemaps');
//var jslint = require('gulp-jslint');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var plumber = require('gulp-plumber');
var beep = require('beepbeep');
var watch = require('gulp-watch');

var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');


gulp.task('lib', function(){
    return gulp
        .src('./bower_components/phaser/build/*.js')
        .pipe(gulp.dest('public/lib'));
});

gulp.task('test', function(){
    return gulp
      .src(['public/**/*.js', '!public/lib/**', 'gulpfile.js', 'deploy.js'])
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStylish))
      .pipe(jshint.reporter('fail')); // fail on errors or warnings
});

gulp.task('js', function(){
    return gulp
      .src(['public/**/*.js', '!public/lib/**'])
      .pipe(plumber({
            errorHandler: function(e){
                  beep();
                  console.log(e);
                  this.emit('end');
              }
          }))
       .pipe(jshint({
                   asi: false
               }))
       .pipe(jshint.reporter(jshintStylish))
       .pipe(connect.reload());
});

// without gulp-watch (but gulp-watch is cool because it only passes in changed files)
// gulp.task('reload', function() {
//         return gulp.src('index.html').pipe(connect.reload())
// })

var port = 2003; 
gulp.task('connect', function() {
  console.log('server started');
  connect.server({
    root: 'public',
    livereload: true,
    port: port
  });
});

gulp.task('launch', function(){
  console.log('launching browser');
  open('http://localhost:' + port);
});

gulp.task('watch', function() {
    console.log('watching...');
    var logevent = function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    };
    gulp.watch('public/**/*.js', ['js']).on('change', logevent);
    //gulp.watch('public/**/*.html', ['reload']).on('change', logevent);
    watch(['public/**/*.html', 'public/**/*.js']).pipe(connect.reload());
    //gulp.watch('**/*.less', ['less']).on('change', logevent);
});



gulp.task('deployArgs', function(cb) {
    var deploy = require("./deploy.js");
    deploy.readFromConfigOrPrompt(function(err) {
        if (err) {
            process.exit(-1);
        } else {
            deploy.display();
        }
        cb();
   });
});

//bad thing note: this updates newer, but leaves old files lying around :(, thus
//todo: use conn.rmdir to blow away target dir entirely allowing for a clean upload
// or fancier, investigate conn.filter to orphaned files and delete them, for a full sync routine, but that sounds like a bit of work
gulp.task( 'deploy', ['deployArgs'], function() {
    var args = require("./deploy.js").deployArgs;
    var deployArgs = {
        host:     args.host,
        user:     args.user,
        password: args.password,
        log:      gutil.log,
        path:     args.path
    };
    
    var conn = ftp.create( deployArgs );
 
    var globs = [
        'public/**', //todo: build to a dest/ folder, using cdnify, so can upload without large phaser.io upload
    ];
 
    // using base = '.' will transfer everything to /public_html correctly 
    // turn off buffering in gulp.src for best performance 
 
    return gulp.src( globs, { base: './public/', buffer: false } ) 
        .pipe( conn.newerOrDifferentSize( deployArgs.path ) ) // only upload newer files or files of differente size
        .pipe( conn.dest( deployArgs.path ) );
 
} );

gulp.task('default', ['lib', 'js', 'connect', 'launch', 'watch']);