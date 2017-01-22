import Browserstack from '../src/utils/browserstack';
import {ARGVS} from '../src/utils/cli';


let browserstack = new Browserstack(ARGVS);

browserstack.getProject()
    .then(() => browserstack.deleteBuilds())
    .then(() => browserstack.deleteProject());




