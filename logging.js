const fs = require("fs");
const logLocation = process.env.LOGLOCATION || "./logs/";
const others = [`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`];

var curLogTime = new Date();
var lastLogTime = curLogTime;

var accessLog, errorLog;

var qWriteout = [];
var qWriteerr = [];

var unhook_stdout;
var unhook_stderr;

function exitRouter(options, exitCode)
{
	if (typeof accessLog !== "undefined")
	{
		accessLog.end();
		accessLog = undefined;
	}
	if (typeof errorLog !== "undefined")
	{
		errorLog.end();
		errorLog = undefined;
	}
	unhook_stdout();
	unhook_stderr();
	if (exitCode || exitCode === 0) console.log(`ExitCode ${exitCode}`);
	if (options.exit) process.exit();
}

function exitHandler(exitCode)
{
	console.log(`ExitCode ${exitCode}`);
	console.log("Exiting finally...");
}

function setupLogFiles()
{
	var curYear = curLogTime.getFullYear();
	var curMonth = curLogTime.getMonth()+1;
	curMonth = curMonth < 10 ? `0${curMonth}` : curMonth;
	var curDay = curLogTime.getDate();
	curDay = curDay < 10 ? `0${curDay}` : curDay;

	accessLog = fs.createWriteStream(`${logLocation}${curYear}-${curMonth}-${curDay}-access.log`, {flags: "a"});
	errorLog = fs.createWriteStream(`${logLocation}${curYear}-${curMonth}-${curDay}-error.log`, {flags: "a"});
}

function formatConsoleDate(date)
{
	if (typeof date === "undefined")
	{
		date = new Date();
	}
	var hours = date.getHours();
	hours = hours < 10 ? `0${hours}` : hours;
	var minutes = date.getMinutes();
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	var seconds = date.getSeconds();
	seconds = seconds < 10 ? `0${seconds}` : seconds;
	var milliseconds = date.getMilliseconds();
	milliseconds =  '00' + milliseconds;
	milliseconds = milliseconds.slice(-3);

	return `[${hours}:${minutes}:${seconds}.${milliseconds}] `;
}

function hook_stream(stream, callback)
{
	var old_write = stream.write;
	stream.write = (function(write)
	{
		return function(string, encoding, fd)
		{
			write.apply(stream, arguments);
			callback(string, (typeof encoding === "string") ? encoding : "utf8", fd);
		}
	})(stream.write);

	return function()
	{
		stream.write = old_write;
	};
}

function updateLogFileLocations()
{
	curLogTime = new Date();

	if (curLogTime.getDate() != lastLogTime.getDate())
	{
		if (typeof accessLog !== "undefined" && accessLog.writable)
		{
			accessLog.write("Closing log file.", "utf8");
		}
		if (typeof errorLog !== "undefined" && errorLog.writable)
		{
			errorLog.write("Closing log file.", "utf8");
		}

		accessLog.close();
		errorLog.close();

		var curYear = curLogTime.getFullYear();
		var curMonth = curLogTime.getMonth()+1;
		curMonth = curMonth < 10 ? `0${curMonth}` : curMonth;
		var curDay = curLogTime.getDate();
		curDay = curDay < 10 ? `0${curDay}` : curDay;

		accessLog = fs.createWriteStream(`${logLocation}${curYear}-${curMonth}-${curDay}-access.log`, {flags: "a"});
		errorLog = fs.createWriteStream(`${logLocation}${curYear}-${curMonth}-${curDay}-error.log`, {flags: "a"});

		if (typeof accessLog !== "undefined" && accessLog.writable)
		{
			accessLog.write("Started log file.", "utf8");
		}
		if (typeof errorLog !== "undefined" && errorLog.writable)
		{
			errorLog.write("Started log file.", "utf8");
		}
	}

	lastLogTime = curLogTime;
}

const setupLogging = () =>
{
	console.log("Setting up logging ...");
	others.forEach((eventType) =>
	{
		process.on(eventType, exitRouter.bind(null, {exit: true}));
	});
	process.on("exit", exitHandler);
	if (!fs.existsSync(logLocation))
	{
		fs.mkdirSync(logLocation, {recursive: true});
	}
	setupLogFiles();

	unhook_stdout = hook_stream(process.stdout, function(string, encoding, fd)
	{
		updateLogFileLocations();
		if (typeof accessLog !== "undefined" && accessLog.writable)
		{
			if (qWriteout.length > 0)
			{
				for (var x in qWriteout)
				{
					accessLog.write(qWriteout[x][0], qWriteout[x][1]);
				}
				qWriteout = [];
			}
			accessLog.write(formatConsoleDate() + string.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ''), encoding);
		}
		else
		{
			qWriteout.push([formatConsoleDate() + string.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ''), encoding]);
		}
	});

	unhook_stderr = hook_stream(process.stderr, function(string, encoding, fd)
	{
		updateLogFileLocations();
		if (typeof errorLog !== "undefined" && errorLog.writable)
		{
			if (qWriteerr.length > 0)
			{
				for (var x in qWriteerr)
				{
					errorLog.write(qWriteerr[x][0], qWriteerr[x][1]);
				}
				qWriteerr = [];
			}
			errorLog.write(formatConsoleDate() + string.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ''), encoding);
		}
		else
		{
			qWriteerr.push([formatConsoleDate() + string.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, ''), encoding]);
		}
	});

	console.log("Logging setup complete.");
};

module.exports = setupLogging;