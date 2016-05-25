/**
 * --------------------------------------------------------------
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

import $ from 'jquery';
import jQuery from 'jquery';
import {Config} from './models/config';
import {Course} from './models/course';
//import * as crossroads from 'crossroads';

// export for others scripts to use
//window.$ = $;
window.jQuery = jQuery;


let objConfig = new Config();

objConfig.onLoad(
    ( data ) => {
        //new Course( data.languages.primary );
    }
);

objConfig.defaultLanguage().then( language => { new Course( language ) } );
