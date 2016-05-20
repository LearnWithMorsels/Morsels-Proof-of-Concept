/**
 * _____________________________________________________________
 *
 * ███╗   ███╗ ██████╗ ██████╗ ███████╗███████╗██╗     ███████╗
 * ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██╔════╝██║     ██╔════╝
 * ██╔████╔██║██║   ██║██████╔╝███████╗█████╗  ██║     ███████╗
 * ██║╚██╔╝██║██║   ██║██╔══██╗╚════██║██╔══╝  ██║     ╚════██║
 * ██║ ╚═╝ ██║╚██████╔╝██║  ██║███████║███████╗███████╗███████║
 * ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝
 * _____________________________________________________________
 *
 * ------------------{ BITE-SIZED ELEARNING }------------------
 *    __      ___   ___       __      __   ___   __
 *   |__)  |   |   |__   __  /__`  |   /  |__   |  \
 *   |__)  |   |   |___      .__/  |  /_  |___  |__/
 *   ___         ___    _    __                   __
 *  |__   |     |__    /_|  |__)  |\ |  |  |\ |  / _`
 *  |___  |___  |___  /  |  |  \  | \|  |  | \|  \__/
 * _____________________________________________________________
 */

import {ConfigModel} from './models/config';
import {Course} from './models/course';

var objConfig = new ConfigModel( 'app/config.json' );

console.log( objConfig.promise );

objConfig.promise.then(
    () => {
        Course( objConfig.get( 'languages' ).primary )
            .then(
                ( course ) => {
                    console.log( 'Theme: ' + objConfig.get( 'theme' ) );
	                console.log( 'Course:', course );
	                for( var section of course._sections ) {
		                console.log( 'Section: ' + section.title, section );
		                for( var card of section._cards ) {
			                console.log( 'Card: ' + card.title, card );

		                }
	                }
                }
            );
    }
);