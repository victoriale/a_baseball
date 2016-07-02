# HomeRunLoyal - Frontend

install the latest version of node.js https://nodejs.org/en/

Be sure to be in the `develop` branch

install each one individually

1. `npm install` (Once pulled you may install each individually with ex: `npm install -g gulp-cli`) or skip step 1. and go to step 2.

      a.`-g gulp-cli`

      b.`gulp-less`

      c.`gulp-clean-css`

      d.`gulp-minify`

      e.`gulp-less`

      f.`gulp-concat`

      g.`core-js` (used to replace es6-shim and load IE 11 quickly)

      h.`connect-history-api-fallback`

      i.`browser-sync`

      j.`highcharts` (used for any type of graphs)

      k.`moment` (used for time manipulation of dates)

      l.`moment-timezone`

      m.`autoprefixer` (automatically adds browser prefixes to css file)

      n.`fuse.js` (Lightweight JSON search library for client side)

2. `npm i`

3. `gulp serve`

Less files will be compiled to: `dist/app/global/stylesheets/master.css`

Router fix:
https://github.com/BrowserSync/browser-sync/issues/204
