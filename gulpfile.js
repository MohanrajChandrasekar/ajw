var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');  

gulp.task('default', ['nodemon']);

gulp.task('nodemon', function() {
    const envs = env.set({
        NODE_ENV: 'development'
    });

    nodemon({
            script: 'server/server.js',
            ext: 'js',
            ignore: ['./node_modules/**','src/*.*'],
        })
        .on('restart', function() {
            console.log('Restarting');
        });
});
 