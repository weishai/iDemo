/**
 * f2e-workflow v1.5.6
 * https://github.com/Mobile-Team/f2e-workflow
 * @hzlzh
<hzlzh.dev@gmail.com>
    */

// grunt-timer 返回各个task的执行时间
//var timer = require("grunt-timer");

module.exports = function (grunt) {

    // grunt-timer 初始化
    //timer.init(grunt);

    // Grunt 配置初始化
    grunt.initConfig({

        // 读取 package.json 依赖
        pkg: grunt.file.readJSON('package.json'),


        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          build: {
            files: [
              {
                expand: true,     // Enable dynamic expansion.
                cwd: 'js',      // Src matches are relative to this path.
                src: ['**.js'], // Actual pattern(s) to match.
                dest: 'publish/js/',   // Destination path prefix.
                ext: '.js',   // Dest filepaths will have this extension.
                flatten: true
              }
            ]
          }
        },

        less: {
          development: {
            options: {
              // compress: true,
              // cleancss: true,
              optimization: 2
            },
            files: {
              // target.css file: source.less file
              "css/g.css": "less/g.less"
            }
          }
        },

        watch: {
          style: {
            // Which files to watch (all .less files recursively in the less directory)
            files: ['less/**/*.less'],
            tasks: ['less'],
            options: {
              spawn: false
            }
          }
        },

        // CSS 压缩 (https://github.com/gruntjs/grunt-contrib-cssmin)
        cssmin: {
            options: {
              report: 'gzip'
            },
            min: {
                files: [
                    {
                        expand: true,
                        cwd: 'publish/css',
                        src: ['*.css'],
                        dest: 'publish/css',
                        ext: '.css'
                    }
                ]
            }
        },

        // 自动合并生成雪碧图
        sprite: {
            options: {
                // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
                imagepath: 'asset/',
                // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
                spritedest: 'publish/img/',
                // 替换后的背景路径，默认 ../images/
                spritepath: '../img/',
                // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
                padding: 2,
                // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
                newsprite: false,
                // 给雪碧图追加时间戳，默认不追加
                spritestamp: false,
                // 在CSS文件末尾追加时间戳，默认不追加
                cssstamp: false,
                // 默认使用二叉树最优排列算法
                algorithm: 'binary-tree',
                // 默认使用`pngsmith`图像处理引擎
                engine: 'pngsmith'
            },
            autoSprite: {
                files: [{
                    //启用动态扩展
                    expand: true,
                    // css文件源的文件夹
                    cwd: 'css',
                    // 匹配规则
                    src: ['*.css'],
                    //导出css和sprite的路径地址
                    dest: 'publish/css/',
                    // 导出的css名
                    ext: '.css'
                }]
            }
        },

        // imagemin: {
        //     dist: {
        //       options: {
        //         //png图片的压缩率
        //         //optimizationLevel: 3
        //       },
        //       files: [
        //             // {
        //             //     src: ['tem/sprite/*.png'],
        //             //     dest: 'publish/sprite/'
        //             // },
        //             {
        //                 expand: true,
        //                 cwd: 'pic/',
        //                 src: ['**/*.{png,jpg,gif}'],
        //                 dest: 'publish/img/'
        //             }
        //         ]
        //     }
        //   },

        // PNG 压缩 (更多配置说明：https://www.npmjs.org/package/grunt-pngmin)
        pngmin: {
            compile: {
                options: {
                    ext: '.png',  // 后缀名
                    force: true,  // 生成优化后的图片覆盖原始图片
                    iebug: false  // 为 IE6 优化图片，如需要可设置`true`
                },
                files: [
                    {
                        src: ['publish/img/*.png'],
                        dest: 'publish/img/'
                    },
                    {
                        src: ['img/*.png'],
                        dest: 'publish/img/'
                    },
                    {
                        expand: true,
                        cwd: 'pic/',
                        src: ['**/*.png'],
                        dest: 'publish/pic',
                        ext: '.png'
                    }
                ]
            }
        },

        // 复制文件夹操作
        copy: {

            // 移动 slice/ 到 tmp/ 供下一步的 合并雪碧图 task 使用
            slice: {
                files: [
                    {expand: true, cwd: 'slice/', src: ['**'], dest: 'tmp/slice/'},
                ]
            },

            // copy 分支 -> 开发向
            dev: {
                files: [
                    {expand: true, cwd: 'html/', src: ['**'], dest: 'publish/html/'}
                ]
            },
        },


        // 自动生成 @2x 图片对应的 @1x 图 (已存在图片不再生成，仅缺失图片触发此操作)
        _2x2x: {
            scale: {
                imgsrcdir: "asset", // 源目录，此目录中的 @2x -> @1x
                imgdesdir: "asset", // 目标目录
                option: {
                    'overwrite': true // 是否覆盖原图
                }
            }
        },

        //hash 文件
        hash_files: {
          img: {
            options: {
              'name': 'hash'
            },
            files:{
              src: ['img/*'],
                dest: 'publish/img'
            }
          },
          css: {
            options: {
              'name': 'replace'
            },
            files:{
              src: 'demo/css/*.css',
              dest: 'demo/publish/css'
            }
          }
        },
        // 实时上传测试服务器
        http_upload: {
            wapstatic: {
                options: {
                  url: 'http://ued.wsd.com/receiver/receiver.php',
                  method: 'POST',
                  to: '/data/wapstatic/wheatowu/test_street/'
                },

                src: 'publish/**',
                dest: 'file'
            }
        },


        // 清理临时目录
        clean: {
            // clean 开发向
            dev: ['tmp/','publish/sprite/', 'release/'],
            // clean 发布向
            release: ['tmp/', 'publish/', 'release/'],
            // clean 调试向
            debug: ['tmp/', 'publish/slice/']
        }
    });

    // 加载官方插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 加载其他插件
    grunt.loadNpmTasks('grunt-css-sprite');
    grunt.loadNpmTasks('grunt-2x2x');
    grunt.loadNpmTasks('grunt-pngmin');
    // grunt.loadNpmTasks('grunt-http-upload');
    // grunt.loadTasks('tasks');



    // 定义别名 `grunt sprite-cssmin`
    // 注：拷贝移动 slice -> 合并雪碧图 sprite -> CSS 压缩
    //grunt.registerTask('sprite-cssmin', ['copy:slice', 'sprite', 'cssmin']);
    grunt.registerTask('sprite-cssmin', ['sprite', 'cssmin', 'pngmin', 'copy:dev']);

    grunt.registerTask('push', ['http_upload']);

    grunt.registerTask('tocss', ['less', 'watch:style']);

    // 定义别名 `grunt 2x2x`
    // 注：@2x 图 生成 @1x 图
    grunt.registerTask('2x2x', ['_2x2x']);

    grunt.registerTask('publish', ['less', 'sprite', 'cssmin', 'pngmin', 'uglify:build', 'copy:dev']);

}