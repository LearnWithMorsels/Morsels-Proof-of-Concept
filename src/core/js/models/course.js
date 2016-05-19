export function CourseModel( strLanguage ) {

    var promise = new Promise( ( resolve, reject ) => {
            fetch( '../../morsels/app/course/' + strLanguage + '.json' )
                .then( response => response.json() )
                .then( data => resolve( data ) )
                .catch( e => reject( e ) )
        }
    );

    promise.then(
        ( data ) => { /*console.info( 'Got the data!', data )*/ },
        ( e ) => { console.error( ':(', e ) }
    );

    return promise;

}