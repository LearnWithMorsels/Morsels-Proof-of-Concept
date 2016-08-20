export class Video extends Card {

    constructor( properties, parent ) {

        super( properties, parent );

        this.view = 'cards/video/video.hbs';

        this.render();

    }

}