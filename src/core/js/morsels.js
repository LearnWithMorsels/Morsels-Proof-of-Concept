import {ConfigModel} from './models/config';

var objConfig = new ConfigModel( '../morsels/app/config.json' );

console.log( JSON.stringify( objConfig.data() ) );