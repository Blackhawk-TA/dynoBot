/**
 * Utils module optimized for re-use in custom js modules to simplify string formatting
 * @type {{arrayToString: function(Array, string): string}}
 */
module.exports = {
	/**
	 * Converts an array into a string
	 * @param {array} array The array to be converted
	 * @param {string} separator The string between each array item
	 * @return {string} The formatted array as string
	 */
	arrayToString: function(array, separator) {
		let string = "";

		array.forEach(function(item) {
			string = string.concat(item, separator);
		});

		return string.trim().slice(0, -1);
	}
};