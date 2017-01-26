#! ./node_modules/.bin/babel-node

import prompt from 'prompt';
import colors from 'colors/safe';

import Browserstack from '../src/utils/browserstack';
import {ARGVS} from '../src/utils/cli';

//prompt.colors = true;

if (!ARGVS.browserstackKey) {
    console.log('Usage: ./tasks/clean-browserstack-project [--project projectname] --browserstack-user <user> --browserstack-key key');
    console.log('      --project          name of the browserstack project (default: selenium-protractor');
    process.exit(0);
}
let browserstack = new Browserstack(ARGVS);

prompt.start();

browserstack.getProject()
    .then(() => {
        prompt.message = '';

        let schema = {
            properties: {
                confirm: {
                    description: `${colors.red('Are you sure you want to erase project')} '${colors.bold.green(browserstack.project)}' ${colors.grey.bgGreen('[Yn]')}`,
                    required: false,
                    conform: (input) => {
                        return input === null || input.match(/^[ny]$/i);
                    }
                }
            }
        };

        prompt.get(schema, (err, result) => {
            if (err) {
                console.log(err);
                return 1;
            } else {
                let input = result.confirm;

                if (input.match(/^[y]*$/i)) {
                    browserstack.getProject()
                        .then(() => browserstack.deleteBuilds())
                        .then(() => browserstack.deleteProject())
                        .then(() => console.log(colors.grey.bgGreen('Project deleted')));
                } else {
                    console.log(colors.underline.bold.bgYellow.white('Aborted!!'));
                    return 1;
                }
            }
        });
    });

