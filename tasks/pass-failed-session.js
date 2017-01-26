#! ./node_modules/.bin/babel-node

import colors from 'colors/safe';

import Browserstack from '../src/utils/browserstack';
import {getUserConfirmation, ARGVS} from '../src/utils/cli';

if (!ARGVS.browserstackUser || !ARGVS.browserstackKey) {
    console.log('Usage: ./tasks/pass-failed-sessions.js --browerstack-user <user> --browserstack-key <key> [--project <project>] [--session-id id]');
    process.exit(1);
}

let browserstack = new Browserstack(ARGVS),
    promise = Promise.resolve();

if (!ARGVS.sessionId) {
    promise = getUserConfirmation(`${colors.red('Are you sure you want to pass all failed sessions for project')} '${colors.bold.green(browserstack.projectDisplayName)}' ${colors.grey.bgGreen('[Yn]')}`)
        .then(() => {
            },
            () => {
                console.log(colors.grey.bgGreen('Project deleted'));
                process.exit();
            });
}

let update;

promise.then(() => getUserConfirmation(`${colors.red('Do you want to delete or update failed sessions')} ${colors.grey.bgGreen('[Ud]')}`, 'ud', '', 'ud'))
    .then((input) => {
        update = input !== 'd';
    })
    .then(() => {
        return browserstack.getProject()
    })
    .then(() => browserstack.getBuild())
    .then(builds => {
        (builds || []).forEach(build => {
            browserstack.getSession(build.hashed_id)
                .then(sessions => {
                    (sessions || []).forEach(session => {
                        if (session.status === 'passed' || session.status === 'done') {
                            console.log('sdfsdfsdfsdfs');
                            if (update) {
                                //browserstack.update('passed', session.automation_session.hashed_id);
                            } else {
                                //browserstack.deleteSession(session.automation_session.hashed_id);
                            }
                        }
                    });
                })
        });
    });
