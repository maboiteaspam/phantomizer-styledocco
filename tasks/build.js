'use strict';

module.exports = function(grunt) {

  var fs = require('fs');
  var optimist = require('optimist');
  var path = require('path');


  grunt.registerTask("phantomizer-styledocco", "", function () {
    var done = this.async();

    var options = this.options({
      "basePath":"",
      "src_pattern":[],
      "out_dir":"",
      verbose:true
    });

// StyleDocco Command Line Interface
// =======================================================================
// Normalizes options to pass to StyleDocco.
    var paths = [];
    for(var n in options.src_pattern ) paths.push( path.normalize(options.src_pattern[n]) )
    var out_dir = path.normalize(options.out_dir);

// Abort and show current version number.
    if (optimist.argv.version != null) {
      return console.log("StyleDocco " + (require('../package').version));
    }

// initialize output directory
    grunt.file.mkdir(out_dir)

// Create doccooptions
    var doccooptions = {}

// Set project name
    try { doccooptions.name = require(process.cwd() + '/package').name; }
    catch (ex) { doccooptions.name = ''; }

    doccooptions.out = out_dir;
    doccooptions.include = [];
    doccooptions.in = grunt.file.expand({}, paths);
    if( doccooptions.in.length == 0 ){
      grunt.log.warn("Files not found in "+paths)
      return done(true);
    }
    doccooptions.verbose = options.verbose;

// Get common (absolute) path prefix of input files
    doccooptions.basePath = path.normalize(options.basePath);

// count files to process, add 1 for extra index
    var filescount = doccooptions.in.length+1;

// save stdout handler and rewrite it
// so that we are able to catch doccostyle output
    var original_console = console.log;
    var total_output = "";
    var cur_f_count = 0;

// crate finish handler to format output
    var finish = function(success, output){
      // reset stdout writer handler
      if(!success ){
        grunt.log.warn(output);
      }else{
        for(var n in paths ){
          output = treat_stdout(output,paths[n].replace("**/*.css",""),out_dir);
        }
        grunt.log.ok(output);
      }

      console.log = original_console;

      done(success)
    };

    console.log = function(in_string){
      if( in_string.substring(0,("styledocco:").length) == "styledocco:" ){
        cur_f_count = cur_f_count+1
      }
      total_output+=cur_f_count+"/"+filescount+" "+in_string+"\n";
      if( cur_f_count == filescount ){
        finish(true, total_output)
      }
    }

    try{
// run docco style
      require('styledocco/cli')(doccooptions);
    }catch(ex){
      // reset stdout writer handler
      finish(false,ex)
    }

  });

  // treat stdout ouptu to make it more compact and readable
  function treat_stdout( stdout,src_path,out_path ){
    var retour = [];
    stdout = stdout.split("\n");
    for( var n in stdout ){
      retour.push(stdout[n].replace(src_path,"").replace(out_path,"").replace("styledocco: writing ",""))
    }
    return retour.join("\n");
  }

};