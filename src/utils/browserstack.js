import childProcess from 'child_process';

//let spawn = childProcess.spawn;
let exec = childProcess.exec;

function extract(json, matchKey, findVal, preKey) {
    return json.find(item => (preKey ? item[preKey][matchKey] : item[matchKey]) === findVal);
}

export default class Browserstack {
    constructor(config = {}) {
        this._config = config;

        if (config.build) {
            this.build = {name: config.build};
        }

        config.name = this.session.name;
    }

    get project() {
        return this._project || {name: this._config.project};
    }

    set project(project) {
        if (project) {
            this._project = project;
        }
    }

    get build() {
        return this._build || {};
    }

    set build(build) {
        this._build = build;
    }

    get session() {
        if (!this._session) {
            this._session = {name: (this._config.prefix ? this._config.prefix + '-' : '') + (0 | Math.random() * 9e6).toString(16)};
        }

        return this._session;
    }

    set session(session) {
        this._session = session;
    }

    get user() {
        return this._config.browserstackUser;
    }

    get key() {
        return this._config.browserstackKey;
    }


    badgeKey() {
        let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects/${this.project.id}/badge_key`;

        return new Promise(resolve => {
            exec(cmd, (error, stdout, stderr) => resolve(stdout));
        });
    }

    getProject() {
        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);
                let project = extract(json, 'name', this.project.name);

                if (!project) {
                    console.error(`Project '${this.project.name}' does not exist!`);
                    console.log('Available projects are:');
                    (json || []).forEach(projectObj => {
                        console.log(`   ${projectObj.name}`);
                    });
                    process.exit(0);
                }

                this.project = project;
                resolve(project);
            });
        });
    }

    deleteProject() {
        let cmd = `curl -u "${this.user}:${this.key}" -X DELETE https://www.browserstack.com/automate/projects/${this.project.id}.json`;

        return new Promise(resolve => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) throw error;
                console.log(stdout);

                resolve();
            });
        });
    }

    getBuild(buildName) {
        if (this.build.name === buildName && buildName) {
            return this.build;
        }

        buildName = buildName || this.build.name;

        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects/${this.project.id}.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);

                if (buildName) {
                    let build = extract(json.project.builds, 'name', buildName);
                    this.build = json.project.builds = build;
                }

                resolve(json.project.builds);
            });
        });
    }

    deleteBuild(build) {
        let cmd = `curl -u "${this.user}:${this.key}" -X DELETE https://www.browserstack.com/automate/builds/${build.hashed_id}.json`;

        return new Promise(resolve => {
            exec(cmd, (error, stdout, stderr) => {
                console.log(stdout);

                resolve();
            });
        });
    }

    deleteBuilds() {
        return new Promise(resolve => {
            this.getBuild()
                .then(builds => {
                    let promises = [];
                    builds.forEach(build => {
                        promises.push(this.deleteBuild(build));
                    });

                    Promise.all(promises).then(resolve);
                });
        });
    }

    getSession(build) {
        build = build || this.build;

        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/builds/${build.hashed_id}/sessions.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);

                if (this._session) {
                    let session = extract(json, 'name', this.session.name, 'automation_session');

                    if (session) {
                        this.session = session.automation_session;
                        json = this.session;
                    }
                }

                resolve(json);
            });
        });

    }

    updateSession(status, sessionId) {
        let cmd = `curl -u "${this.user}:${this.key}" -X PUT -H "Content-Type: application/json" -d "{\\"status\\":\\"${status}\\", \\"reason\\":\\"TODO\\"}" https://www.browserstack.com/automate/sessions/`,
            session = {hashed_id: (sessionId || this.session.hashed_id)};

        return this.getProject()
            .then(() => {
                if (!sessionId) {
                    return this.getBuild()
                }
            })
            .then(() => {
                return sessionId ? session : this.getSession();
            })
            .then((session) => {
                cmd += `${session.hashed_id}.json`;

                return new Promise(resolve => {
                    exec(cmd, (error, stdout, stderr) => resolve());
                });
            });
    }

    deleteSession(sessionId) {
        let cmd = `curl -u "${this.user}:${this.key}" -X DELETE https://www.browserstack.com/automate/sessions/${sessionId}.json`;

        return new Promise(resolve => {
            exec(cmd, (error, stdout, stderr) => resolve());

        });

    }
}
