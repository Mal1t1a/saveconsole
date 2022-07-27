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
[19:37:38.544] Logging setup complete.
[19:37:38.544] My first log file!
[19:37:38.547] ExitCode 0
```

> ./logs/YYYY-MM-DD-error.log
```
[19:37:38.544] Oh no my first error!
```
