saveconsole
===========

[![NPM](https://nodei.co/npm/saveconsole.png)](https://nodei.co/npm/saveconsole/)

Saveconsole will log all of your console's stdout and stderr into -access.log and -error.log files in an organized log folder. These log files are automatically created and organized by the current date/time on the system. Additionally, Saveconsole will add a timestamp to each line to ensure you can accurately search your logs.

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