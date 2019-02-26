const Stream = require('stream');
const os = require('os');

let stream;

/**
 * pipe the data
 *
 * @since 2.0.0
 *
 * @return object
 */

function pipe(data)
{
	data.map(item => stream.push(JSON.stringify(item) + os.EOL));
	stream.pipe(process.stdout);
}

/**
 * parse the stream
 *
 * @since 2.0.0
 *
 * @return object
 */

function parse(data)
{
	return data
		.toString('utf8')
		.split(os.EOL)
		.map(dataValue =>
		{
			if (dataValue)
			{
				try
				{
					return JSON.parse(dataValue);
				}
				catch (exception)
				{
					return null;
				}
			}
		})
		.filter(dataValue => dataValue);
}

/**
 * init
 *
 * @since 2.0.0
 */

function init()
{
	stream = new Stream.PassThrough();
}

module.exports =
{
	pipe,
	parse,
	init
};
