if (typeof require !== 'undefined') {
  var Vec2 = require('vec2');
}

var isArray = function (a) {
  return Object.prototype.toString.call(a) === "[object Array]";
}

var isFunction = function(a) {
  return typeof a === 'function';
}

var defined = function(a) {
  return typeof a !== 'undefined';
}

function Circle(position, radius, last) {
  if (!(this instanceof Circle)) {
    return new Circle(position, radius, last);
  }

  this.position = position || new Vec2(0, 0);
  this.radius(radius || 1);

  this.position.change(this.notify.bind(this));
  this._watchers = [];
}

Circle.prototype._watchers = [];
Circle.prototype._radius = 1;
Circle.prototype._radiusSquared = 1;

Circle.prototype.isCircle = true;
Circle.prototype.position = null;

Circle.prototype.area = function() {
  return Math.PI * this._radiusSquared;
}

Circle.prototype.circumference = function() {
  return Math.PI * (this._radius * 2);
}

Circle.prototype.radius = function(radius) {
  if (typeof radius !== 'undefined') {
    this._radius = Vec2.clean(radius);
    this._radiusSquared = radius*radius;
    this.notify();
  }

  return this._radius;
};

Circle.prototype.notify = function() {
  var w = this._watchers, l = w.length;
  for (var i=0; i<l; i++) {
    w[i](this);
  }
};

Circle.prototype.change = function(fn) {
  this._watchers.push(fn);
  return fn;
};

Circle.prototype.ignore = function(fn) {
  if (!fn) {
    this._watchers = [];
  } else {
    this._watchers = this._watchers.filter(function(a) {
      return a!==fn;
    });
  }
  return this;
};

Circle.prototype.containsPoint = function(vec) {
  if (isArray(vec)) {
    vec = Vec2.fromArray(vec);
  }

  vec = Vec2(vec);
  return this.position.subtract(vec, true).lengthSquared() <= this._radiusSquared;
};

Circle.prototype.contains = function(thing) {

  if (!thing) {
    return false;
  }

  // Other circles
  if (isFunction(thing.radius) && thing.position) {
    if (thing.radius() < this._radius && this.containsPoint(thing.position)) {
      var radius = thing.radius();
      var distance =  thing.position.subtract(this.position).lengthSquared();
      return distance + radius*radius <= this._radiusSquared;
    }
  } else if (typeof thing.points !== 'undefined') {

    var points, l;
    if (isFunction(thing.points)) {
      points = thing.points();
    } else if (isArray(thing.points)) {
      points = thing.points;
    }

    l = points.length;

    for (var i=0; i<l; i++) {
      if (!this.containsPoint(points[i])) {
        return false;
      }
    }

    return true;
  } else if (
    defined(thing.x1) &&
    defined(thing.x2) &&
    defined(thing.y1) &&
    defined(thing.y2)
  ) {

    return this.containsPoint(thing.x1, thing.y1) &&
           this.containsPoint(thing.x2, thing.y2)

  } else if (defined(thing.x) && defined(thing.y)) {

    var x2, y2;

    if (defined(thing.w) && defined(thing.h)) {
      x2 = thing.x+thing.w;
      y2 = thing.y+thing.h;
    }

    if (defined(thing.width) && defined(thing.height)) {
      x2 = thing.x+thing.width;
      y2 = thing.y+thing.height;
    }

    return this.containsPoint(thing.x1, thing.y1) && this.containsPoint(x2, y2);
  }

  return false;
};

if (typeof module !== "undefined" && typeof module.exports == "object") {
  module.exports = Circle;
}

if (typeof window !== "undefined") {
  window.Circle = window.Circle || Circle;
}
