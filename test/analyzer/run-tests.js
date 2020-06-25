const fs = require('fs');

const Jasmine = require('jasmine');
const Reporter = require('jasmine-terminal-reporter');

const PAGE_SPEC_FILES = 'page/test*.js';
const defaultSpecFiles = [
    'test*.js',
    'mine-args/test*.js',
    'mine-deps/test*.js'
];


let stdout, stderr, exit,
    isSlimer, args,
    specFiles;

try {
    // if this runs OK, we are in SlimerJS
    ({stdout, stderr} = require('system'));
    exit = slimer.exit;
    args = process.argv.slice(1);
    isSlimer = true;
} catch {
    // we are in NodeJS
    ({stdout, stderr} = process);
    exit = process.exit;
    args = process.argv.slice(2);
    isSlimer = false;
}

const jasmine = new Jasmine({
    projectBaseDir: __dirname
});

if (isSlimer) {
    defaultSpecFiles.push(PAGE_SPEC_FILES);
}

for (const arg of args) {
    if (arg === '--ensure-slimer') {
        if (!isSlimer) {
            console.error(
                'Error: --ensure-slimer is given, but tests are not running ' +
                'on SlimerJS!'
            );
            exit(1);
        }
    } else {
        specFiles = specFiles || [];
        specFiles.push(arg);
    }
}

specFiles = specFiles || defaultSpecFiles;

jasmine.loadConfig({
    spec_files: specFiles
});

jasmine.configureDefaultReporter({
    showColors: false,
    print: () => {} // silence default reporter
});

jasmine.addReporter(new Reporter({
    print: s => stdout.write(s),
    isVerbose: true
}));

jasmine.onComplete(function(passed) {
    exit(passed ? 0 : 1);
});

jasmine.execute();
