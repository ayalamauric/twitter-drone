const ora = require('ora');
const wordingArray = require('../wording.json');

let spinner;

/**
 * start
 *
 * @since 1.0.0
 *
 * @param text string
 */

function start(text)
{
	spinner.start(text);
}

/**
 * stop
 *
 * @since 1.0.0
 *
 * @param text string
 */

function stop(text)
{
	spinner.stop(text);
}

/**
 * pass
 *
 * @since 1.0.0
 *
 * @param text string
 */

function pass(text)
{
	spinner.succeed(text);
}

/**
 * warn
 *
 * @since 1.0.0
 *
 * @param text string
 */

function warn(text)
{
	spinner.warn(text);
}

/**
 * fail
 *
 * @since 1.0.0
 *
 * @param text string
 */

function fail(text)
{
	spinner.fail(text);
}

/**
 * skip
 *
 * @since 1.0.0
 *
 * @param text string
 */

function skip(text)
{
	spinner.info(text);
}

/**
 * init
 *
 * @since 1.0.0
 */

function init(initArray)
{
	spinner = ora(initArray);
	start(wordingArray.please_wait + wordingArray.point.repeat(3));
}

module.exports =
{
	init: init,
	start: start,
	stop: stop,
	pass: pass,
	warn: warn,
	fail: fail,
	skip: skip
};