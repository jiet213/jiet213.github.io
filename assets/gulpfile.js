// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint'); //检测js

var less = require('gulp-less'); //编译less

var concat = require('gulp-concat'); // 合并文件

var uglify = require('gulp-uglify'); // js压缩

var minifyCSS = require('gulp-minify-css'); //压缩css

//var coffee = require('gulp-imagemin');
var rename = require('gulp-rename'); // 重命名

var livereload = require('gulp-livereload');

//var rimraf = require('rimraf');
//配置目录
var paths = {

    less: ['./less/**/*.less'],

    css: ['./css/*.css']

};

var option = {

    //所有页面都要依赖的 frame.less 配置
    frame_all: {

        file: ['./less/common/common.less','./less/common/reset.less'],

        dest: './css',

        mini_file: ['./css/*.css'],

        mini_dest: './css_build'

    },
    //library配置
    library: {

        file: ['./less/main/**/*.less'],

        dest: './css/main',

        mini_file: ['./css/main/*.css'],

        mini_dest: './css_build/main'
    }

};

// gulp.task('clean', function(cb){
//   rimraf('e:/xm/', cb);
// });

// 检查脚本
// gulp.task('lint', function() {
//    gulp.src(paths.scripts)
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// 编译Less
gulp.task('less', function() {

    //编辑所有页面都要依赖的frame.less,相当于 common.less 名称不同而已
    gulp.src(option.frame_all.file)
        .pipe(less())
        .pipe(gulp.dest(option.frame_all.dest));

    //编辑 library
    gulp.src(option.library.file)
        .pipe(less())
        .pipe(gulp.dest(option.library.dest));

});

//压缩css
gulp.task('minify-css', function() {

    //压缩css 直属子css文件
    gulp.src(option.frame_all.mini_file)
        .pipe(minifyCSS({
            keepBreaks: false,
            "compatibility": "ie7"
        }))
        .pipe(gulp.dest(option.frame_all.mini_dest));

    //压缩library
    gulp.src(option.library.mini_file)
        .pipe(minifyCSS({
            keepBreaks: false,
            "compatibility": "ie7"
        }))
        .pipe(gulp.dest(option.library.mini_dest));
});

// 合并，压缩文件
// gulp.task('scripts', function() {
//    gulp.src(paths.scripts)
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('./dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('./dist'));
// });
// 监听文件变化

// gulp.task('default', function(){
//  gulp.run('lint', 'less','minify-css','scripts');
//     gulp.watch(paths.scripts,['lint','scripts']);
//     gulp.watch(paths.less,['less','minify-css']);
// });

gulp.task('default', function() {
    gulp.run('less', 'minify-css');
    gulp.watch(paths.less, ['less', 'minify-css']);


});

// 默认任务
//gulp.task('default',['lint', 'less', 'scripts']);
