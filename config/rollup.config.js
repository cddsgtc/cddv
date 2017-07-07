// import {rollup} from 'rollup'
import uglify from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'
import babel from 'rollup-plugin-babel'
export default{
    entry:'src/main.js',
    format:"umd",
    dest:'index.js',
    moduleName:'cddv',
    plugins:[
        uglify({},minify),
        babel({
            exclude:'node_modules/**'
        })
    ]
}