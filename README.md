# HomeRunLoyal - Frontend

install the latest version of node.js https://nodejs.org/en/

Be sure to be in the `develop` branch

install each one individually

1 `npm i` update node package with all dependencies in package.json

2. `npm install` if step 1 does not work (Once pulled you may install each individually with ex: `npm install -g gulp-cli`) or skip step 1. and go to step 2.

      a.`-g gulp-cli`

      b.`gulp-less`

      c.`gulp-clean-css`

      d.`gulp-concat`

      e.`core-js` (used to replace es6-shim and load IE 11 quickly)

      f.`connect-history-api-fallback`

      g.`browser-sync`

      h.`highcharts` (used for any type of graphs)

      i.`moment` (used for time manipulation of dates)

      j.`moment-timezone`

      k.`autoprefixer` (automatically adds browser prefixes to css file)

      l.`fuse.js` (Lightweight JSON search library for client side)

      m. `hammer.js` (used for touch events for mobile)

3. `gulp serve`

Less files will be compiled to: `dist/app/global/stylesheets/master.css`


Router fix:
https://github.com/BrowserSync/browser-sync/issues/204
