import os from 'os';
import optimist from 'optimist';
import inquirer from 'inquirer';
import confirm from 'inquirer-confirm';

export default class Cli {
    static get defaults() {
        return Cli._defaults || {
                'browserstack-user': process.env.BROWSERSTACK_USERNAME,
                'browserstack-key':  process.env.BROWSERSTACK_ACCESS_KEY,
            };
    }

    static set defaults(defaults) {
        this._defaults = Object.assign(this.defaults, defaults);
    }

    // --

    static set host(host) {
        this._host = host;
    }

    static set name(name) {
        this._name = name;
    }

    static set prefix(prefix) {
        this._prefix = prefix;
    }

    static get browser() {
        return Cli.getArgv('browser');
    }

    static get browserstackUser() {
        return Cli.getArgv('browserstack-user');
    }

    static get browserstackKey() {
        return Cli.getArgv('browserstack-key');
    }

    static get host() {
        return this._host || 'localhost';
    }

    static get os() {
        return Cli.getArgv('os');
    }

    static get osVersion() {
        return Cli.getArgv('osVersion');
    }

    static get prefix() {
        return Cli.getArgv('prefix');
    }

    static get project() {
        return Cli.getArgv('project');
    }


    static get seleniumStandalone() {
        return Cli.getArgv('selenium-standalone');
    }

    static get sessionId() {
        return Cli.getArgv('session-id')
    }

    static get version() {
        return Cli.getArgv('browser-version');
    }

    static get y() {
        return getArgv('y');
    }

    static get local() {
        return Cli.getArgv('local');
    }

    static get name() {
        return Cli.getArgv('name');
    }

    static getArgv(name) {
        //        set by app      command line args      defaults or environment vars
        return Cli[`_${name}`] || optimist.argv[name] || this.defaults[name];
    }

    static buildArgs() {
        return new Promise(resolve => {
           if (Cli.local && !Cli.host) {
                if (Cli.local === true) {
                    Cli.getIp()
                        .then(ip => {
                            Cli.host = ip;
                            resolve(Cli.args);
                        });
                } else {
                    Cli.host = Cli.local;
                    resolve(Cli.args);
                }

            } else {
                resolve(Cli.args);
            }
        });
    }

    static get args() {
        return {
            browser:            Cli.browser,
            host:               Cli.host,
            seleniumStandalone: Cli.seleniumStandalone,
            browserstackUser:   Cli.browserstackUser,
            browserstackKey:    Cli.browserstackKey,
            name:               Cli.name,
            os:                 Cli.os,
            osVersion:          Cli.osVersion,
            prefix:             Cli.prefix,
            project:            Cli.project || 'e2e-testing-in-action',
            sessionId:          Cli.sessionId
        };
    }

    static getIp() {
        let interfaces = os.networkInterfaces(),
            addresses = [];

        return new Promise(resolve => {
            for (let i in interfaces) {
                for (let j in interfaces[i]) {
                    let address = interfaces[i][j];
                    if (address.family === 'IPv4' && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }

            if (addresses.length > 0) {
                Cli.prompt({
                    name: 'ip',
                    message: 'Which IP should be used?',
                    type: 'list',
                    choices: addresses,
                }, (output) =>  resolve(output.ip));
            } else {
                resolve(addresses[0]);
            }
        });
    }

    static prompt(questions, callback) {
        inquirer.prompt(questions, callback);
    }

    static confirm(message, confirmed, cancelled) {
        confirm(message)
            .then(confirmed, cancelled);
    }
}

/*
 const ARGVS = {},
 KNOWN_OPTIONS = ['browser', 'browser-version', 'selenium-standalone', 'browserstack-user', 'browserstack-key', 'os', 'os-version', 'project', 'session-id', 'y', 'ip'],
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

 if (ARGVS.ip && !ARGVS.ip.match(/\./)) {
 var os = require('os');

 var interfaces = os.networkInterfaces();
 var addresses = [];
 for (var k in interfaces) {
 for (var k2 in interfaces[k]) {
 var address = interfaces[k][k2];
 if (address.family === 'IPv4' && !address.internal) {
 addresses.push(address.address);
 }
 }
 }

 console.log(addresses);
 }

 export {ARGVS};
 */

// Only for Yes and No questions
/*
prompt
    .message = '';
prompt
    .start();

export function

getUserConfirmation(question = 'confirm', yesChar = 'y', noChar = 'n') {
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
*/
