#! ./node_modules/.bin/babel-node

import colors from 'colors/safe';

import Browserstack from '../src/utils/browserstack';
import Config from '../tests/config';
import Cli from '../src/utils/cli';

if (!Config.browserstackUser || !Config.browserstackKey) {
    console.log('Usage: ./tasks/pass-failed-sessions.js --browerstack-user <user> --browserstack-key <key> [--project <project>] [--session-id id]');
    process.exit(1);
}

let browserstack = new Browserstack(Config),
    promise = Promise.resolve();

if (!Config.sessionId) {
    promise = new Promise(resolve => {
        Cli.confirm(`${colors.red('Are you sure you want to process all failed sessions for project')} '${colors.bold.green(Config.project)}'`,
            resolve,
            () => {
                console.log(colors.grey.bgGreen('Aborted'));
                process.exit();
            });
    });
}

promise = promise.then(() => browserstack.getProject());

promise.then(() => {
    Cli.confirm(`${colors.red('Do you want to delete all failed sessions')}`,
        () => {
            performAction('delete');
        },
        () => {
            performAction('update');
        });
});

function performAction(action) {
    console.log(`As you wish, all failed sessions will be ${action}d for project ${colors.bold.green(Config.project)}`);

    browserstack.getBuild()
        .then(builds => {
            (builds || []).forEach(build => {
                browserstack.getSession(build)
                    .then(sessions => {
                        (sessions || []).forEach(session => {
                            let status = session.automation_session.status;

                            if (session.automation_session.status === 'failed') {
                                console.log('  Build ' + colors.bgGreen.white(build.name));

                                if (action === 'update') {
                                    console.log(`    ${colors.underline('updated')} session ${colors.yellow(session.automation_session.name)}`);
                                    browserstack.updateSession('passed', session.automation_session.hashed_id);
                                } else {
                                    console.log(`    ${colors.underline('deleted')} session ${colors.yellow(session.automation_session.name)}`);
                                    browserstack.deleteSession(session.automation_session.hashed_id);
                                }
                            }
                        });
                    });
            });
        });
}
