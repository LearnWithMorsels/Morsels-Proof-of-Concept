/**
 *
 * ███╗   ███╗ ██████╗ ██████╗ ███████╗███████╗██╗     ███████╗
 * ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██╔════╝██║     ██╔════╝
 * ██╔████╔██║██║   ██║██████╔╝███████╗█████╗  ██║     ███████╗
 * ██║╚██╔╝██║██║   ██║██╔══██╗╚════██║██╔══╝  ██║     ╚════██║
 * ██║ ╚═╝ ██║╚██████╔╝██║  ██║███████║███████╗███████╗███████║
 * ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝
 *
 * -------------------{ BITE-SIZED ELEARNING }-------------------
 */

import {ConfigModel} from './models/config';
import {Course} from './models/course';

var objConfig = new ConfigModel();

objConfig.promise.then(
    () => {
        Course( objConfig.get( 'languages' ).primary );
    }
);