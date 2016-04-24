if (typeof require !== 'undefined') {
  var Vec2 = require('vec2');
  var circumcenter = require('circumcenter');
  var subdivideArc = require('subdivide-arc');
}

var isArray = function (a) {
  return Object.prototype.toString.call(a) === "[object Array]";
}

var isFunction = function(a) {
  return typeof a === 'function';
}

var isNumber = function(a) {
  return typeof a === 'number';
}

var defined = function(a) {
  return typeof a !== 'undefined';
}

function Circle(position, radius, last) {
  if (!(this instanceof Circle)) {
    return new Circle(position, radius, last);
  }

  this._watchers = [];

  this.init(position, radius, last)

  this.position.change(this.notify.bind(this));
}

Circle.prototype.computeCenterFromPoints = function() {
  var center = circumcenter(this.points.map(function(vec) {
    return vec.toArray()
  }));

  this.position.set(center[0], center[1], false);
  this.radius(this.position.distance(this.points[0]));
}

Circle.prototype.init = function(position, radius, last) {
  this.radius(radius || 1)
  this.position = new Vec2(0, 0)

  if (!position) return

  if (isArray(position)) {
    if (isNumber(position[0])) {
      this.position = new Vec2(position)
    } else {
      var boundCompute = this.computeCenterFromPoints.bind(this)
      this.points = position.map(function(point) {
        if (!(point instanceof Vec2)) {
          point = Vec2(point);
        }

        // hookup listeners to recompute the origin + position
        point.change(boundCompute);
        return point
      })

      this.computeCenterFromPoints()


    }
    return // arrays have been handled
  }

  if (position instanceof Vec2) {
    this.position = position
    return // Vec2 case handled
  }

  this.position = new Vec2(position)
}

Circle.prototype._watchers = null;
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
      var distance =  thing.position.subtract(this.position, true).lengthSquared();
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

Circle.prototype.intersectCircle = function(circle) {
  var p1 = this.position;
  var p2 = circle.position;
  var r1 = this.radius();
  var r2 = circle.radius();

  if (p1.equal(p2)) {
    // identical circles
    if (r1 === r2) {
      return [];

    // no intersection because one circle is
    // contained in the other
    } else {
      return false;
    }
  }

  var d2 = p1.subtract(p2, true).lengthSquared();
  var rsquared = (r1 + r2) * (r1 + r2);
  if (d2 > rsquared) {
    return false;

  // single intersection
  } else if (d2 === rsquared) {
    return [p1.subtract(p2, true).divide(2).add(p2)];
  }

  var d = Math.sqrt(d2);
  var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  var h = Math.sqrt(r1 * r1 - a * a);
  var x0 = p1.x + a * (p2.x - p1.x) / d;
  var y0 = p1.y + a * (p2.y - p1.y) / d;
  var rx = -(p2.y - p1.y) * (h / d);
  var ry = -(p2.x - p1.x) * (h / d);

  return [
    new Vec2(x0 + rx, y0 - ry),
    new Vec2(x0 - rx, y0 + ry)
  ];
};

Circle.prototype.toSegments = function(count) {
  return subdivideArc(
    this.position.x,
    this.position.y,
    this.radius(),
    0, Math.PI * 2,
    count || 100
  );
};


if (typeof module !== "undefined" && typeof module.exports == "object") {
  module.exports = Circle;
}

if (typeof window !== "undefined") {
  window.Circle = window.Circle || Circle;
}
