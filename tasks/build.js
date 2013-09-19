'use strict';

module.exports = function(grunt) {


    grunt.registerTask("phantomizer-styledocco", "", function () {
        var done = this.async();

        var options = this.options();
        var basePath = options.basePath;
        var paths = options.src_pattern;
        var out_dir = options.out_dir;

// StyleDocco Command Line Interface
// =======================================================================
// Normalizes options to pass to StyleDocco.

        var fs = require('fs');
        var optimist = require('optimist');
        var path = require('path');

        if( fs.existsSync(out_dir) == false ){
            fs.mkdirSync(out_dir);
        }

// Abort and show current version number.
        if (optimist.argv.version != null) {
            return console.log("StyleDocco " + (require('../package').version));
        }

// Create options
        var options = {}

// Set project name
        try { options.name = require(process.cwd() + '/package').name; }
        catch (ex) { options.name = ''; }

        options.out = out_dir
        options.include = []
        options.in = grunt.file.expand({}, paths);
        options.verbose = true

// Get common (absolute) path prefix of input files
        options.basePath = basePath

// run docco style
        var filescount = options.in.length-1

        var p = process.stdout.write
        process.stdout.write = (function(write) {
            var cur_f_count = 0
            return function(in_string, encoding, fd) {

                if( in_string.substring(0,("styledocco:").length) == "styledocco:" ){
                    cur_f_count = cur_f_count+1
                }

                write.apply(process.stdout, arguments)

                if( cur_f_count == filescount ){
                    process.stdout.write = p
                    done()
                }
            }
        })(process.stdout.write)
        try{
            require('styledocco/cli')(options);
        }catch(ex){
            process.stdout.write = p
            console.log(ex)
            done()
        }

    });

};