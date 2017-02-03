#! ./node_modules/.bin/babel-node

import colors from 'colors/safe';

import Browserstack from '../src/utils/browserstack';
import Config from '../tests/config';
import Cli from '../src/utils/cli';

if (!Config.browserstackKey) {
    console.log('Usage: ./tasks/clean-browserstack-project [--project projectname] --browserstack-user <user> --browserstack-key key');
    console.log('      --project          name of the browserstack project (default: selenium-protractor');
    process.exit(0);
}
let browserstack = new Browserstack(Config);

browserstack.getProject()
    .then(() => {
        Cli.confirm(`${colors.red('Are you sure you want to erase project')} '${colors.bold.green(Config.project)}'`,
            () => {
                browserstack.getProject()
                    .then(() => browserstack.deleteBuilds())
                    .then(() => browserstack.deleteProject())
                    .then(() => console.log(colors.grey.bgGreen('Project deleted')));
            },
            () => {
                console.log(colors.underline.bold.bgYellow.white('Aborted!!'));
                process.exit();
            });
    });

