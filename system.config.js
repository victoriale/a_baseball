(function(global) {

    // map tells the System loader where to look for things
    var map = {
        'app':                        'dist/app', // this is where your transpiled files live
        'rxjs':                       'node_modules/rxjs',
        'symbol-observable':          'node_modules/symbol-observable',
        '@angular':                   'node_modules/@angular'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { format: "register",  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'symbol-observable':          { defaultExtension: 'js' }
    };

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
        packages: packages
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);
})(this);
