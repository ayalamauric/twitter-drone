let optionArray = require('../option.json');

/**
 * get
 *
 * @since 1.0.0
 *
 * @param name string
 *
 * @return string
 */

function get(name)
{
	return optionArray[name];
}

/**
 * init
 *
 * @since 2.0.0
 *
 * @param initArray array
 */

function init(initArray)
{
	optionArray =
	{
		...optionArray,
		...initArray
	};
}

module.exports =
{
	get,
	init
};