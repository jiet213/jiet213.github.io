// 引入 gulp
var gulp = require('gulp');

//编译less
var less = require('gulp-less');

//压缩css
var minifyCSS = require('gulp-minify-css');


//配置目录
var paths = {

    less: ['./less/**/*.less'],

    css: ['./css/*.css']

};

var option = {

    //所有页面都要依赖的 frame.less 配置
    frame_all: {

        file: ['./less/common/common.less'],

        dest: './css',

        mini_file: ['./css/*.css'],

        mini_dest: './css_build'

    },
    //library配置
    library: {
		//!是排除的意思
        file: ['./less/**/*.less', '!./less/common/*.less','!./less/define/*.less'],

        dest: './css',

        mini_file: ['./css/**/*.css'],

        mini_dest: './css_build'
    }

};

// 编译Less,压缩css
gulp.task('compile', function() {

    //编辑所有页面都要依赖的frame.less,相当于 common.less 名称不同而已
    gulp.src(option.frame_all.file)
    	//编译less
        .pipe(less())
        .pipe(gulp.dest(option.frame_all.dest))
        //压缩
        .pipe(minifyCSS({
            keepBreaks: false,
            "compatibility": "ie7"
        }))
        .pipe(gulp.dest(option.frame_all.mini_dest));

    //编辑 library
    gulp.src(option.library.file)
        .pipe(less())
        .pipe(gulp.dest(option.library.dest))
        .pipe(minifyCSS({
            keepBreaks: false,
            "compatibility": "ie7"
        }))
        .pipe(gulp.dest(option.library.mini_dest));

});

// 默认任务
gulp.task('default', function() {

    gulp.run('compile');

    gulp.watch(paths.less, ['compile']);

});

