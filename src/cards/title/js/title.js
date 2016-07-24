export class Title extends Card {

    constructor( properties, parent ) {

        super( properties, parent );

        this.view = 'cards/title/title.hbs';

        this.render();

    }

}