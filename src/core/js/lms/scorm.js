import pipwerks from '../../lms/scorm/SCORM_API_wrapper';

export class SCORM {

	constructor( config ) {

		this.config = config;
		this.isConnected = false;
		this.status = null;

		this.setVersion( this.config.version );
		this.init();

		if( this.isComplete() ) {
			if( this.complete() ) {
				pipwerks.SCORM.quit();
			}
		}

	}

	setVersion( version ) {

		pipwerks.SCORM.version = version;

	}

	isComplete() {

		return this.status === 'completed';

	}

	complete() {

		return this.markCourseAs( 'completed' );

	}

	markCourseAs( status ) {

		return pipwerks.SCORM.set( 'cmi.core.lesson_status', status );

	}

	init() {

		if( pipwerks.SCORM.init() ) {
			this.isConnected = true;
			this.status = pipwerks.SCORM.get( 'cmi.core.lesson_status' );
		}

	}

}