#! ./node_modules/.bin/babel-node

import colors from 'colors/safe';

import Browserstack from '../src/utils/browserstack';
import {getUserConfirmation, ARGVS} from '../src/utils/cli';

if (!ARGVS.browserstackKey) {
    console.log('Usage: ./tasks/clean-browserstack-project [--project projectname] --browserstack-user <user> --browserstack-key key');
    console.log('      --project          name of the browserstack project (default: selenium-protractor');
    process.exit(0);
}
let browserstack = new Browserstack(ARGVS);

browserstack.getProject()
    .then(() => {
        getUserConfirmation(`${colors.red('Are you sure you want to erase project')} '${colors.bold.green(browserstack.project)}' ${colors.grey.bgGreen('[Yn]')}`)
            .then(() => browserstack.getProject(),
                () => {
                    console.log(colors.underline.bold.bgYellow.white('Aborted!!'));
                    process.exit();
                }
            )
            .then(() => browserstack.deleteBuilds())
            .then(() => browserstack.deleteProject())
            .then(() => console.log(colors.grey.bgGreen('Project deleted')))
    });

