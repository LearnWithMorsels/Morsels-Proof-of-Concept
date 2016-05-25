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

//import $ from 'jquery';
import jQuery from 'jquery';
import {Config} from './models/config';
import {Course} from './models/course';
//import * as crossroads from 'crossroads';
import * as Handlebars from 'handlebars';
//import {Binding, update} from 'handlebarsbinding';
import * as HandlebarsBinding from 'handlebarsbinding';

// export for others scripts to use
//window.$ = $;
window.jQuery = jQuery;
window.Handlebars = Handlebars;

let objConfig = new Config();

objConfig.onLoad(
    ( data ) => {
        //new Course( data.languages.primary );
    }
);

objConfig.defaultLanguage().then( language => { new Course( language ) } );
