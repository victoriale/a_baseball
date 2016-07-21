(function(global) {

    // map tells the System loader where to look for things
    var map = {
        "@angular/core"                    : "dist/lib/core",
        "@angular/common"                  : "dist/lib/common",
        "@angular/compiler"                : "dist/lib/compiler",
        "@angular/router-deprecated"       : "dist/lib/router-deprecated",
        "@angular/http"                    : "dist/lib/http",
        "@angular/platform-browser"        : "dist/lib/platform-browser",
        "@angular/platform-browser-dynamic": "dist/lib/platform-browser-dynamic",
        "symbol-observable"                : "dist/lib",
        "rxjs"                             : "dist/lib",
        'app'                              : 'dist/app' // this is where your transpiled files live
        'jquery'                           : '//code.jquery.com/jquery-2.2.3.min.js',
        'owl-carousel'                     : '//cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.1.6/owl.carousel.js' 
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { format: "register",  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'symbol-observable':          { defaultExtension: 'js' }
    };

    var meta = {
      'owl-carousel': {
        deps: ['jquery']
      }
    },

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router-deprecated',
        '@angular/http',
        '@angular/testing',
        '@angular/upgrade',
        'symbol-observable'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function(pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        packages: packages,
        meta: meta
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);
})(this);
