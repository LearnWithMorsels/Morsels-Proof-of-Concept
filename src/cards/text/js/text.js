export class Text extends Card {

    constructor( properties, parent ) {

        super( properties, parent );

        //console.log( 'Text card initiated' );

        this.view = 'cards/text/text.hbs';

        this.render();

    }

}