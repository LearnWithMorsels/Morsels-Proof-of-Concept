function elementExists( strTag ) {
	switch( document.createElement( strTag ).constructor ) {
		case HTMLElement:
			return false;
		case HTMLUnknownElement:
			return undefined;
	}

	return true;
}

export function elementcreator( strTag ) {
	return new ( elementExists( strTag ) ? document.createElement( strTag ).constructor : document.registerElement( strTag ) );
}