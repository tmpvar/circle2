if (typeof require !== 'undefined') {
  var Vec2 = require('vec2');
}

// TODO:
//  - 2 point circles
//  - 3 point circles

function Circle(position, radius, last) {
  if (!(this instanceof Circle)) {
    return new Circle(x, y);
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
  return this.position.subtract(vec, true).lengthSquared() <= this._radiusSquared;
};

Circle.prototype.contains = function(thing) {

  // Other circles
  if (typeof thing.radius === 'function' && thing.position) {
    if (thing.radius() < this._radius && this.containsPoint(thing.position)) {
      var radius = thing.radius();
      var distance =  thing.position.subtract(this.position).lengthSquared();
      return distance + radius*radius <= this._radiusSquared;
    }
  } else if (typeof thing.points === 'function') {
    var points = thing.points(), l = points.length;

    for (var i=0; i<l; i++) {
      if (!this.containsPoint(points[i])) {
        return false;
      }
    }

    return true;
  }

  return false;
};

Circle.prototype.containedBy = function(thing) {

};

if (typeof module !== "undefined" && typeof module.exports == "object") {
  module.exports = Circle;
}

if (typeof window !== "undefined") {
  window.Circle = window.Circle || Circle;
}
