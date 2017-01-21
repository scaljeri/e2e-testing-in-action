import Browserstack from '../src/browserstack';
import {ARGVS} from '../src/cli';


let browserstack = new Browserstack(ARGVS);

browserstack.getProject()
    .then(() => browserstack.deleteBuilds())
    .then(() => browserstack.deleteProject());




