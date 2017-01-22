import optimist from 'optimist';

const ARGVS = {},
    KNOWN_OPTIONS = ['browser', 'browser-version', 'selenium-standalone', 'browserstack-user', 'browserstack-key', 'os', 'os-version', 'project'],
    OPTIONS = optimist.argv;

KNOWN_OPTIONS.forEach((option) => {
    let optionValue = OPTIONS[option];

    if (optionValue !== undefined) {
        let camelCase = option.replace(/-(\w)/g, (match) => match.slice(-1).toUpperCase());

        ARGVS[camelCase] = optionValue;
    }
});

export {ARGVS};

