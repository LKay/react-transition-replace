// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/lapkom/Documents/Projects/react-transition-replace/www/.cache/dev-404-page.js")),
  "component---src-pages-index-tsx": preferDefault(require("/Users/lapkom/Documents/Projects/react-transition-replace/www/src/pages/index.tsx"))
}

exports.json = {
  "dev-404-page.json": require("/Users/lapkom/Documents/Projects/react-transition-replace/www/.cache/json/dev-404-page.json"),
  "index.json": require("/Users/lapkom/Documents/Projects/react-transition-replace/www/.cache/json/index.json")
}

exports.layouts = {

}