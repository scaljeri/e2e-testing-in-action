import childProcess from 'child_process';

//let spawn = childProcess.spawn;
let exec = childProcess.exec;

export default class Browserstack {
    constructor(options = {}) {
        this._options = options;

        this.project = options.project || 'selenium-protractor';
        this.build = options.build;
    }

    get project() {
        return this._project;
    }

    set project(project) {
        this._project = project;
    }

    get build() {
        return this._build;
    }

    set build(build) {
        this._build = build;
    }

    get session() {
        if (!this._session) {
            this._session = (this._options.prefix ? this._options.prefix + '-' : '') + (0 | Math.random() * 9e6).toString(16);
        }

        return this._session;
    }

    get user() {
        return this._options.browserstackUser;
    }

    get key() {
        return this._options.browserstackKey;
    }

    extract(json, matchKey, findVal, preKey) {
        return json.find(item => (preKey ? item[preKey][matchKey] : item[matchKey]) === findVal);
    }

    getProject() {
        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);
                let project = this.extract(json, 'name', this.project.replace(/-/g, ' '));
                this.projectId = project.id;

                resolve();
            });
        });
    }

    getBuild() {
        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects/${this.projectId}.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);
                let build = this.extract(json.project.builds, 'name', this.build);
                this.buildId = build.hashed_id;

                resolve();
            });
        });
    }

    getSession() {
        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/builds/${this.buildId}/sessions.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);
                let session = this.extract(json, 'name', this.session, 'automation_session');
                this.sessionId = session.automation_session.hashed_id;

                resolve(this.sessionId);
            });
        });

    }

    update(status) {
        return this.getProject()
            .then(() => this.getBuild())
            .then(() => this.getSession())
            .then((sessionId) => {
                let cmd = `curl -u "${this.user}:${this.key}" -X PUT -H "Content-Type: application/json" -d "{\\"status\\":\\"${status}\\", \\"reason\\":\\"TODO\\"}" https://www.browserstack.com/automate/sessions/${sessionId}.json`;

                return new Promise(resolve => {
                    exec(cmd, (error, stdout, stderr) => {
                        resolve();
                    });

                });
            });
    }
}