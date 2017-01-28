import optimist from 'optimist';
import prompt from 'prompt';
import colors from 'colors/safe';

const ARGVS = {},
    KNOWN_OPTIONS = ['browser', 'browser-version', 'selenium-standalone', 'browserstack-user', 'browserstack-key', 'os', 'os-version', 'project', 'session-id', 'y'],
    OPTIONS = optimist.argv;

KNOWN_OPTIONS.forEach((option) => {
    let optionValue = OPTIONS[option];

    if (optionValue !== undefined) {
        let camelCase = option.replace(/-(\w)/g, (match) => match.slice(-1).toUpperCase());

        ARGVS[camelCase] = optionValue;
    }
});

let browserstackUser = process.env.BROWSERSTACK_USERNAME,
    browserstackKey = process.env.BROWSERSTACK_ACCESS_KEY;

if (!ARGVS.browserstackUser && browserstackUser) {
    console.log(colors.yellow('Using browserstack credentials from environment variables!!'));
    ARGVS.browserstackUser = browserstackUser;
}

if (!ARGVS.browserstackKey && browserstackKey) {
    ARGVS.browserstackKey = browserstackKey;
}

export {ARGVS};

// Only for Yes and No questions
prompt.message = '';
prompt.start();

export function getUserConfirmation(question = 'confirm', yesChar = 'y', noChar = 'n') {
    let schema = {
        properties: {
            confirm: {
                description: question,
                required: false,
                conform: (input) => {
                    return input === null || input.match(new RegExp(`^[${yesChar + noChar}]$`, 'i'));
                }
            }
        }
    };

    if (ARGVS.y) {
        return Promise.resolve('');
    } else {

        return new Promise((resolve, reject) => {
            prompt.get(schema, (err, result) => {
                if (err) {
                    console.log(err);
                    return 1;
                } else {
                    let input = result.confirm;

                    if (input.match(new RegExp(`^[${yesChar}]*$`, 'i'))) {
                        resolve(input.toLowerCase());
                    } else {
                        reject();
                    }
                }
            });
        });
    }
}

