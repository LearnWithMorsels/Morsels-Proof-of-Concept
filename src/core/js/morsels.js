import {ConfigModel} from './models/config';
import {Course} from './models/course';

var objConfig = new ConfigModel( 'app/config.json' );

objConfig.promise.then(
    () => {
        Course( objConfig.get( 'languages' ).primary )
            .then(
                ( data ) => {
                    console.log( data );
                    console.log( 'Sections', data._sections );
                }
            );
    }
);