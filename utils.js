var utils = {
  distance: function() {
    var count = 0;

    if(typeof arguments[0] === 'object') {
      var x1 = arguments[0].x;
      var y1 = arguments[0].y;
      count++;
    } else {
      var x1 = arguments[0];
      var y1 = arguments[1];
      count += 2;
    }

    if(typeof arguments[count] === 'object') {
      var x2 = arguments[count].x;
      var y2 = arguments[count].y;
    } else {
      var x2 = arguments[count++];
      var y2 = arguments[count];
    }

    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
  }
}

module.exports = utils;
