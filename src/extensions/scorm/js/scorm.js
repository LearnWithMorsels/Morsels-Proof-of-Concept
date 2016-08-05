import { Extension } from '../../models/extension.model';
import pipwerks from './SCORM_API_wrapper';

export default class extends Extension {

	constructor( config ) {

		super();

		this.config = config;

		pipwerks.SCORM.version = this.config.version;

		if( pipwerks.SCORM.init() ) {
			var status = pipwerks.SCORM.get( 'cmi.core.lesson_status' );
			if( status != 'completed' ) {
				if( pipwerks.SCORM.set( 'cmi.core.lesson_status', 'completed' ) ) {
					pipwerks.SCORM.quit();
				}
			}
		}
	}
}