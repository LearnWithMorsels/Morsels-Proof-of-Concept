export class Mcq extends Activity {

	constructor( properties, parent ) {

		super( properties, parent );

		this.view = 'activities/mcq/mcq.hbs';

		this.render();

	}

}