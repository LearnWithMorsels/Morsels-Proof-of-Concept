/**
 * ------------------------------------------------------------
 *
 *  ██▙    ▟██ ▟██████▙ ██████▙  ▟██████ ███████ ██     ▟██████
 *  ███▙  ▟███ ██    ██ ██    █▙ ██      ██      ██     ██
 *  ██ ▜██▛ ██ ██    ██ ██████▛  ▜█████▙ █████   ██     ▜█████▙
 *  ██  ▜▛  ██ ██    ██ ██  ▜█▙       ██ ██      ██          ██
 *  ██      ██ ▜██████▛ ██   ▜█▙ ██████▛ ███████ ██████ ██████▛
 *
 * -------------------{ BITE-SIZED ELEARNING }-----------------
 */

import jQuery from 'jquery';
import {Config} from './models/config';
import {Course} from './models/course';
//import * as crossroads from 'crossroads';
import * as Handlebars from 'handlebars';
//import {Binding, update} from 'handlebarsbinding';
import HandlebarsBinding from 'handlebarsbinding';

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

objConfig.defaultLanguage().then( language => { new Course( '#morsel-course', language ) } );
