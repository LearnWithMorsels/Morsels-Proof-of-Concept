/**
 * ------------------------------------------------------------
 *
 *  ██▙    ▟██ ▟██████▙ ███████  ▟██████ ███████ ██     ▟██████
 *  ███▙  ▟███ ██    ██ ██    █▙ ██      ██      ██     ██
 *  ██ ▜██▛ ██ ██    ██ ██████▛  ▜█████▙ █████   ██     ▜█████▙
 *  ██  ▜▛  ██ ██    ██ ██  ▜█▙       ██ ██      ██          ██
 *  ██      ██ ▜██████▛ ██   ▜█▙ ██████▛ ███████ ██████ ██████▛
 *
 * -------------------{ BITE-SIZED ELEARNING }-----------------
 */

import jQuery from 'jquery';
//import {Config} from './models/config';
import {App} from './models/app';
import {Course} from './models/course';
//import * as crossroads from 'crossroads';
import * as Handlebars from 'handlebars';
//import {Binding, update} from 'handlebarsbinding';
import HandlebarsBinding from 'handlebarsbinding';

//window.$ = $;
window.jQuery = jQuery;
window.Handlebars = Handlebars;

//HandlebarsBinding( Handlebars );

new App( '#morsel-course' );
