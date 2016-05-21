/**
 * Search a multidimensional object for a key
 * @param mxdKey {string|string[]} The key to search for with levels separated by a full stop
 * @param objIn {Object} The object to rummage through
 * @returns {*|null}
 * @example
 * var myObject = {
 *   a: {},
 *   b: {
 *     1: {},
 *     2: {
 *       i: 1,
 *       ii: 2,
 *       iii: 3
 *     },
 *     3: {}
 *   },
 *   c: {
 *      foo: 'bar'
 *   }
 * };
 *
 * objectrummage( 'a.1' myObject ); // Returns null
 * objectrummage( 'b.2.iii' myObject ); // Returns 3
 * objectrummage( 'c.foo' myObject ); // Returns 'bar'
 */
export function objectrummage( mxdKey, objIn ) {

	if( Array.isArray( mxdKey ) ) {
		if( mxdKey.length > 1 ) {
			var thisLevel = mxdKey.shift();

			return objectrummage( mxdKey, objIn[thisLevel] );
		} else {
			return objIn[mxdKey[0]] || null;
		}
	} else if( mxdKey.indexOf( '.' ) > -1 ) {
		var arrKeys = mxdKey.split( '.' ),
				thisKey = arrKeys.shift();

		return objectrummage( arrKeys, objIn[thisKey] );
	} else {
		return objIn[mxdKey] || null;
	}

}