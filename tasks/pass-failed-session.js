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
    promise = getUserConfirmation(`${colors.red('Are you sure you want to pass all failed sessions for project')} '${colors.bold.green(browserstack.projectName)}' ${colors.grey.bgGreen('[Yn]')}`)
        .then(() => {
            },
            () => {
                console.log(colors.grey.bgGreen('Aborted'));
                process.exit();
            });
}

let update;

promise.then(() => getUserConfirmation(`${colors.red('Do you want to delete or update failed sessions')} ${colors.grey.bgGreen('[Ud]')}`, 'ud', '', 'ud'))
    .then((input) => {
        update = input !== 'd';
        console.log('As you wish, ' + (update ? colors.yellow('Update') : colors.red('Delete')) + ` sessions for project ${colors.bold.green(browserstack.projectName)}`);
    })
    .then(() => {
        return browserstack.getProject()
    })
    .then(() => browserstack.getBuild())
    .then(builds => {
        (builds || []).forEach(build => {
            let buildName = build.name;
            browserstack.build = build;

            browserstack.getSession()
                .then(sessions => {
                    (sessions || []).forEach(session => {
                        let status = session.automation_session.status;

                        if (session.automation_session.status === 'failed') {
                            if (buildName) {
                                console.log('  Build ' + colors.bgGreen.white(buildName));
                                buildName = null;
                            }
                            if (update) {
                                browserstack.updateSession('passed', session.automation_session.hashed_id);
                                console.log(`    ${colors.underline('updated')} session ${colors.yellow(session.automation_session.name)}`);
                            } else {
                                console.log(`    ${colors.underline('deleted')} session ${colors.yellow(session.automation_session.name)}`);
                                browserstack.deleteSession(session.automation_session.hashed_id);
                            }
                        }
                    });
                })
        });
    });
