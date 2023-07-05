#!/usr/bin/env node
import entry from '../lib/index.js';

console.log(process.argv)
entry(process.argv.slice(2))