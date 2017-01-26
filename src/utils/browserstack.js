import childProcess from 'child_process';

//let spawn = childProcess.spawn;
let exec = childProcess.exec;

export default class Browserstack {
    constructor(options = {}) {
        this._options = options;

        this.projectName = options.project || 'selenium-protractor';
        if (options.build) {
            this.build = {name: options.build};
        }
    }

    get projectName() {
        return this._projectName;
    }

    set projectName(projectName) {
        // TODO: is this needed?
        this._projectName = projectName.replace(/-/g, ' ');
    }

    get project() {
        return this._project;
    }

    set project(project) {
        if (project) {
            this._project = project;
        }
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

    get sessionId() {
        if (!this._sessionId) {
            this._sessionId = (this._options.prefix ? this._options.prefix + '-' : '') + (0 | Math.random() * 9e6).toString(16);
        }
        return this._sessionId;
    }

    set sessionId(sessionId) {
        this._sessionId = sessionId;
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

    badgeKey() {
        let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects/${this.projectId}/badge_key`;

        return new Promise(resolve => {
            exec(cmd, (error, stdout, stderr) => resolve(stdout));
        });
    }

    getProject() {
        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);
                console.log(this.projectDisplayName);
                let project = this.extract(json, 'name', this.projectDisplayName);

                if (!project) {
                    console.error(`Project '${this.project}' does not exist!`);
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
        if (this.build.name === buildName) {
            return this.build;
        }

        buildName = buildName || this.build.name;

        return new Promise(resolve => {
            let cmd = `curl -u "${this.user}:${this.key}" https://www.browserstack.com/automate/projects/${this.projectId}.json`;

            exec(cmd, (error, stdout, stderr) => {
                let json = JSON.parse(stdout);

                if (buildName) {
                    let build = this.extract(json.project.builds, 'name', buildName);
                    this.build = json.project.builds = build;
                }

                resolve(json.project.builds);
            });
        });
    }

    deleteBuild(build) {
        let cmd = `curl -u "${this.user}:${this.key}" -X DELETE https://www.browserstack.com/automate/builds/${build.hashed_id}.json`;
        console.log(cmd);

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

                if (this._sessionId) {
                    let session = this.extract(json, 'name', this.sessionId, 'automation_session');
                    this.sessionId = session.automation_session.hashed_id;
                    json = this.sessionId;
                }

                resolve(json);
            });
        });

    }

    update(status, sessionId) {
        let cmd = `curl -u "${this.user}:${this.key}" -X PUT -H "Content-Type: application/json" -d "{\\"status\\":\\"${status}\\", \\"reason\\":\\"TODO\\"}" https://www.browserstack.com/automate/sessions/`;

        return this.getProject()
            .then(() => {
                if (!sessionId) {
                    return this.getBuild()
                }
            })
            .then(() => {
                return sessionId ? sessionId : this.getSession()
            })
            .then((sessionId) => {
                cmd += `${sessionId}.json`;
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
