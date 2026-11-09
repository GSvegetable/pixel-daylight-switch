'use strict';

// The browser runtime is inert during SSR and exposes mount/unmount when a DOM exists.
module.exports = require('./app.js');
