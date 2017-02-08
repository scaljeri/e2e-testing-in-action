import os from 'os';
import inquirer from 'inquirer';
import confirm from 'inquirer-confirm';

export default class Cli {
    static transformHostToIp(config) {
        return new Promise(resolve => {
            // If the selenium standalone hub is running inside a docker
            // container `localhost` need to be changed to an ip
            Cli.getIp()
                .then(ip => {
                    config.host = ip;
                    resolve();
                });
        });
    }

    static getListOfIps() {
        let interfaces = os.networkInterfaces(),
            addresses = [];

        for (let i in interfaces) {
            for (let j in interfaces[i]) {
                let address = interfaces[i][j];
                if (address.family === 'IPv4' && !address.internal) {
                    addresses.push(address.address);
                }
            }
        }

        return addresses;
    }

    static getIp() {
        let addresses = Cli.getListOfIps();

        return new Promise(resolve => {
            if (addresses.length > 1) {
                Cli.prompt({
                    name: 'ip',
                    message: 'Which IP should be used?',
                    type: 'list',
                    choices: addresses,
                }, (output) => resolve(output.ip));
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
