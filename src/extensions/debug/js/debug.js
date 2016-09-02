import { Extension } from '../../models/extension.model';

export default class extends Extension {

	constructor( config ) {

		super();

		this.config = config;

		this.showDebugHeader();
		this.showStructure();

	}

	showDebugHeader() {

		try {
			var args = [
				'%c %c %c LearnWithMorsels/Morsels %c %c ',
				'font-size: 14px; background: #0AFFE7',
				'font-size: 16px; background: #00CCB8',
				'color: #FFF; font-size: 18px; background: #009688;',
				'font-size: 16px; background: #00CCB8',
				'font-size: 14px; background: #0AFFE7'
			];

			console.log.apply( console, args );
		} catch( e ) {
			if( window.console.info ) {
				console.info( 'LearnWithMorsels/Morsels' );
			} else {
				console.log( 'LearnWithMorsels/Morsels' );
			}
		}

	}

	showStructure() {

		let course = window.Morsels.app.children[0],
			summary = {
				course: {},
				stacks: [],
				cards: []
			};

		this.consoleGroupIfExists( 'COURSE: ' + course.properties.title, true );

		summary.course.hasTitle = ( course.properties.title !== null && course.properties.title !== undefined );

		this.consoleGroupIfExists( 'Properties', true );
		window.console.log( course );
		this.consoleGroupEndIfExists();

		for( let intStack in course.children ) {
			let stack = course.children[intStack];

			summary.stacks[intStack] = {
				hasTitle: ( stack.properties.title !== null && stack.properties.title !== undefined ),
				hasTitle2: stack.properties.title ? '✔' : '✘'
			};

			this.consoleGroupIfExists( 'STACK: ' + stack.properties.title, true );

			this.consoleGroupIfExists( 'Properties', true );
			window.console.log( stack );
			this.consoleGroupEndIfExists();

			for( let intCard in stack.children ) {
				let card = stack.children[intCard];

				summary.stacks[intStack] = {
					stack: intStack,
					hasTitle: ( card.properties.title !== null && card.properties.title !== undefined )
				};

				this.consoleGroupIfExists( 'CARD: ' + card.properties.title, true );
				window.console.log( card );
				this.consoleGroupEndIfExists();
			}

			this.consoleGroupEndIfExists();
		}

		this.consoleGroupEndIfExists();

		//console.table( summary.course );
		//console.table( summary.stacks );
		//console.table( summary.cards );

	}

	consoleGroupIfExists( log, collapse ) {

		if( window.console.group ) {
			if( collapse === true ) {
				window.console.groupCollapsed( log );
			} else {
				window.console.group( log );
			}
		}

	}

	consoleGroupEndIfExists() {

		if( window.console.group ) {
			window.console.groupEnd();
		}

	}

}