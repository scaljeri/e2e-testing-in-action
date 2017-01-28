#! ./node_modules/.bin/babel-node

import Browserstack from '../src/utils/browserstack';
import {ARGVS} from '../src/utils/cli';

if (!ARGVS.browserstackUser || !ARGVS.browserstackKey) {
    console.log('Usage: ./node_modules/.bin/babel-node ./tasks/badge.js --browerstack-user <user> --browserstack-key <key> [--project <project>]');
    process.exit(1);
}

let browserstack = new Browserstack(ARGVS);

browserstack.getProject()
    .then(() => browserstack.badgeKey())
    .then(key => {
        console.log(`![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=${key})`);
        console.log(`<img src='https://www.browserstack.com/automate/badge.svg?badge_key=${key}'/>`);
    });
