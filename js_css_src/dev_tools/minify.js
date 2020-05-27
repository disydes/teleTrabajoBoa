/*
* Favio Figueroa P.
* */

const minify = require('babel-minify');
const path = require('path');
const fs = require('fs');
const less = require('less');
const colors = require('colors/safe');

const LessPluginCleanCSS = require('less-plugin-clean-css');
const cleanCSSPlugin = new LessPluginCleanCSS({advanced: false});

const MINIFIED_JS_FILE_SUFFIX = '-min.js';
const TARGET_FIREFOX_VERSION = '57';
const BABEL_MINIFY_OPTIONS = {
    minifyPreset: {
        "presets": [
            [
                "@babel/preset-env", {
                "targets": {
                    "firefox": TARGET_FIREFOX_VERSION
                }
            }
            ]
        ]
    }
};

const currentWorkingDirectory = process.env.INIT_CWD || process.cwd();
let args = process.argv;

//find files argument
const filesParamIndex = args.indexOf('--files');
if (filesParamIndex) {
    args = args.slice(filesParamIndex + 1);
}

const STATUS_SUCCESS = Symbol();
const STATUS_FAIL = Symbol();
const STATUS_SKIP = Symbol();

function logResult(status, source, destination = '', details = null) {
    const rootPath = process.cwd();
    const srcFormatted = path.relative(rootPath, source);
    const destFormatted = path.relative(rootPath, destination);
    switch (status) {
        case STATUS_SUCCESS:
            console.log(colors.green('[Success]'), srcFormatted, '->', destFormatted);
            break;
        case STATUS_FAIL:
            console.log(colors.red('[Fail]'), srcFormatted, typeof details === 'string' ? details : '');
            if (typeof details === 'object') {
                console.log(details);
            }
            break;
        case STATUS_SKIP:
        default:
            console.log(colors.grey('[Skipped]'), srcFormatted);
    }
}

args.forEach((file, index) => {
    const fileExtension = path.extname(file);
    switch (fileExtension) {
        case '.less': {
            let sourceFullPath = path.join(currentWorkingDirectory, file);
            let minifiedFullPath = path.join(currentWorkingDirectory, path.dirname(file), path.basename(file, fileExtension) + '.css');
            if (path.isAbsolute(file)) {
                sourceFullPath = file;
                minifiedFullPath = path.join(path.dirname(file), path.basename(file, fileExtension) + '.css');
            }
            if (fs.existsSync(sourceFullPath)) {
                const lessSource = fs.readFileSync(sourceFullPath).toString();
                less.render(lessSource, {
                    filename: sourceFullPath,
                    plugins: [cleanCSSPlugin]
                }).then((output) => {
                    try {
                        fs.writeFileSync(minifiedFullPath, output.css);
                        logResult(STATUS_SUCCESS, sourceFullPath, minifiedFullPath);
                    }
                    catch (e) {
                        logResult(STATUS_FAIL, sourceFullPath, minifiedFullPath, e);
                    }
                }, (error) => {
                    logResult(STATUS_FAIL, sourceFullPath, minifiedFullPath, `\n${error.message}\n\n${(error.extract || []).join('\n')}`);
                });
            } else {
                logResult(STATUS_FAIL, sourceFullPath, '', 'File not found');
            }
            break;
        }
        case '.js': {
            if (file.endsWith(MINIFIED_JS_FILE_SUFFIX)) {
                logResult(STATUS_SKIP, file);
            } else {
                let sourceFullpath = path.join(currentWorkingDirectory, file);
                let minifiedFullpath = path.join(currentWorkingDirectory, path.dirname(file), path.basename(file, fileExtension) + MINIFIED_JS_FILE_SUFFIX);
                if (path.isAbsolute(file)) {
                    sourceFullpath = file;
                    minifiedFullpath = path.join(path.dirname(file), path.basename(file, fileExtension) + MINIFIED_JS_FILE_SUFFIX);
                }
                if (fs.existsSync(sourceFullpath)) {
                    try {
                        const { code } = minify(fs.readFileSync(sourceFullpath), {}, BABEL_MINIFY_OPTIONS);
                        fs.writeFileSync(minifiedFullpath, code);
                        logResult(STATUS_SUCCESS, sourceFullpath, minifiedFullpath);
                    }
                    catch (e) {
                        logResult(STATUS_FAIL, sourceFullpath, minifiedFullpath, e);
                    }
                } else {
                    logResult(STATUS_FAIL, sourceFullpath, minifiedFullpath, 'File not found');
                }
            }
            break;
        }
        default: {
            logResult(STATUS_SKIP, file);
        }
    }
});

