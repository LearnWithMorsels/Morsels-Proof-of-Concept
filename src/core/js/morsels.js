import {ConfigModel} from './models/config';

var objConfig = new ConfigModel( '../morsels/app/config.json' );

objConfig.promise.then( () => { console.log( objConfig.get() ) } );
objConfig.promise.then( () => { console.log( objConfig.get( 'theme' ) ) } );