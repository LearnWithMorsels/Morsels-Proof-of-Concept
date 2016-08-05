import { Extension } from '../../models/extension.model';
import pipwerks from './SCORM_API_wrapper';

export default class extends Extension {

	constructor( config ) {

		super( config );

		console.info( 'SCORM' );
		console.log( pipwerks );

		var success = pipwerks.SCORM.init();
		if( success ) {
			var status = pipwerks.SCORM.get( 'cmi.core.lesson_status' );
			if( status != 'completed' ) {
				success = pipwerks.SCORM.set( 'cmi.core.lesson_status', 'completed' );
				if( success ) {
					pipwerks.SCORM.quit();
				}
			}
		}
	}
}