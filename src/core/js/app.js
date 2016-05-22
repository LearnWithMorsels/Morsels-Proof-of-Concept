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

import {Config} from './models/config';
import {Course} from './models/course';
import * as crossroads from 'crossroads';

let objConfig = new Config();

objConfig.onLoad(
    ( data ) => {
        //new Course( data.languages.primary );
    }
);

//objConfig.get( 'theme' ).then( theme => { console.log( 'Theme: ' + theme ) } );

objConfig.defaultLanguage().then( language => { new Course( language ) } );



//var XFoo = document.registerElement('morsel-course');
// document.body.appendChild(new XFoo());