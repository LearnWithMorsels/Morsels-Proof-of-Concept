export class MorselModel {

	constructor( properties ) {
		console.log( 'Morsel ES6 Class!' );
	}

	config( objNewConfig ) {
		if( objNewConfig ) {
			objConfig = objNewConfig;
		}

		return objConfig;
	}

}