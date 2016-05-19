import {ConfigModel} from './models/config';
import {CourseModel} from './models/course';

var objConfig = new ConfigModel( '../morsels/app/config.json' );

objConfig.promise.then(
    () => {
        CourseModel( objConfig.get( 'languages' ).primary )
            .then(
                ( data ) => {
                    console.log( data );
                    console.log( 'Sections', data._sections );
                }
            );
    }
);