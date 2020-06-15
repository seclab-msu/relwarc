const fs = require('fs');

const Jasmine = require('jasmine');
const Reporter = require('jasmine-terminal-reporter');

let stdout, stderr, exit;

try {
    // if this runs OK, we are in SlimerJS
    ({stdout, stderr} = require('system'));
    exit = slimer.exit;
} catch {
    // we are in NodeJS
    ({stdout, stderr} = process);
    exit = process.exit;
}

const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'test/analyzer',
    spec_files: [
        'test*.js'
    ],
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
