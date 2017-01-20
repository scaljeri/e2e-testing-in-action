export default class StatusReporter {
    constructor() {
        this.success = true;
    }

    jasmineStarted(suiteInfo) {}

    suiteStarted(result) {}

    specStarted(result) {}

    specDone(result) {
        if (result.status === 'failed') {
            this.success = false;
        }
    }

    suiteDone(result) {}
}