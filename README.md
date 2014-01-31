# phantomizer-styledocco v0.1.x

> Generate CSS documentation for a Phantomizer project

phantomizer-styledocco is a grunt task specialized
in generating CSS documentation given a Phantomizer project
using StyleDocco tool.


Find out more about StyleDocco

https://github.com/jacobrask/styledocco

Find out more about Phantomizer

http://github.com/maboiteaspam/phantomizer


#### Example config

```javascript
{
  'phantomizer-styledocco': {    // Task
    document: {                  // Target
      options: {                 // Target options
        basePath:'',    // common (absolute) path prefix of input files
        src_pattern:[], // source files patterns
        out_dir:'',     // output directory
        verbose:true    // verbosity mode, default: true
      }
    },
  }
}

```


## Release History


---

