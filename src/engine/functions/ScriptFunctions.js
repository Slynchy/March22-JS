const LineTypes = require('../LineTypes.js');

const Functions = {};

for (let k in LineTypes) {
  if (
    LineTypes[k] === LineTypes.COMMENT ||
		LineTypes[k] === LineTypes.NUM_OF_LINETYPES ||
		LineTypes[k] === LineTypes.NULL_OPERATOR ||
		LineTypes[k] === LineTypes.CHECKPOINT ||
		LineTypes[k] === LineTypes.NARRATIVE ||
		LineTypes[k] === LineTypes.DIALOGUE ||
		LineTypes[k] === LineTypes.NUM_OF_LINETYPES
  ) {
    Functions[LineTypes[k]] = function() {};
  } else {
    Functions[LineTypes[k]] = require('./' + LineTypes[k] + '.js'); //require('__' + LineTypes[k]);
  }
}

module.exports = Functions;
