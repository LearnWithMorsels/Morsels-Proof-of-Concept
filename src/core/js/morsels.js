import {ConfigModel} from './models/config';
import {CourseModel} from './models/course';

var objConfig = new ConfigModel( '../morsels/app/config.json' );

objConfig.promise.then( () => { console.log( objConfig.get() ) } );
objConfig.promise.then( () => { console.log( objConfig.get( 'theme' ) ) } );

CourseModel( 'en' ).then( ( data ) => { console.log( data ) } );