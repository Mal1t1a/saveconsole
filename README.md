saveconsole
===========

[![NPM](https://nodei.co/npm/saveconsole.png)](https://nodei.co/npm/saveconsole/)

Saveconsole will log all of your console's stdout and stderr into -access.log and -error.log files in an organized log folder. These log files are automatically created and organized by the current date/time on the system. Additionally, Saveconsole will add a timestamp in `HH:ii:ss.fff` format to each line to ensure you can accurately search your logs.

```
npm install saveconsole
```

Usage:
======
```
require("saveconsole")();
console.log("My first log file!");
console.error("Oh no my first error!");
```

Output:
==========
> ./logs/2022-07-22-access.log
```
[16:10:10.456] Logging setup complete.
[16:10:10.456] My first log file!
[16:10:10.458] ExitCode 0
```

> ./logs/YYYY-MM-DD-error.log
```
[16:10:10.456] Oh no my first error!
```
