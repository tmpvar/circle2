var Circle = require("../circle2.js");
var Vec2 = require("vec2");
var test = require('tape');

test('Circle() takes a point and radius', function(t) {
  var circle = new Circle(Vec2(0, 0), 10);
  t.equal(circle.radius(), 10);
  t.end();
});

test('Circle() takes 3 points (array)', function(t) {

  var circle = new Circle([
    [0, 10],
    [10, 0],
    [0, -10]
  ]);

  t.equal(circle.radius(), 10);
  t.ok(circle.position.equal(Vec2(0, 0)));

  t.end();
});

test('Circle() takes 3 points (Vec2)', function(t) {

  var points = [
    Vec2(0, 10),
    Vec2(10, 0),
    Vec2(0, -10)
  ];

  var circle = new Circle(points);

  t.equal(circle.radius(), 10);
  t.ok(circle.position.equal(Vec2(0, 0)));

  points[0].set(0, 6);
  points[1].set(6, 0);

  circle.change(function() {
    t.ok(circle.position.equal(Vec2(3, 3)));
    t.equal(circle.radius(), 4.24264069);
    t.end();
  });

  points[2].set(0, 0);

});

test('Circle() has sane defaults', function(t) {
  var circle = new Circle();
  t.ok(circle.position.equal(Vec2(0, 0)));
  t.equal(circle.radius(), 1);
  t.end();
});

test('Circle() creates a Circle without the new keyword', function(t) {
  var circle = Circle(Vec2(1, 1));
  t.ok(circle.position.equal(Vec2(1, 1)));
  t.end();
});

test('change() notifies listeners', function(t) {
  var c = new Circle();
  c.change(function(obj) {
    t.ok(obj === c);
    t.end();
  });
  c.notify();
});

test('change() returns the passed function', function(t) {
  var c = new Circle();
  t.equal(c.change(true), true);
  t.end();
});

test('ignore() removes a listener', function(t) {
  var c = new Circle(), called = false;

  var fn = function(obj) {
    called = true;
  };

  c.change(fn);
  c.ignore(fn);
  c.notify();

  t.ok(!called);
  t.end();
});

test('should remove all listeners when a fn is not passed', function(t) {
  var c = new Circle(), called = false;

  var fn = function(obj) {
    called = true;
  };

  c.change(fn);
  c.ignore();
  c.notify();

  t.ok(!called);
  t.end();
});

test('radius() acts like a getter and a setter', function(t) {
  var circle  = new Circle();

  circle.radius(10);
  t.equal(circle.radius(), 10);

  circle.radius(5.45);
  t.equal(circle.radius(), 5.45);
  t.end();
});

test('radius() notifies when changed', function(t) {
  var circle  = new Circle();
  circle.change(function() {
    t.end();
  });

  circle.radius(10);
});

test('radius() cleans incoming values', function(t) {
  var circle  = new Circle();
  circle.radius(0.1 + 0.2);
  t.equal(circle.radius(), 0.3);
  t.end();
});

test('containsPoint() returns true if passed point is inside', function(t) {
  var circle  = new Circle(Vec2(0, 0), 10);

  t.ok(circle.containsPoint(Vec2(0, 0)));
  t.end();
});

test('containsPoint() returns true if passed point is on the boundary', function(t) {
  var circle  = new Circle(Vec2(0, 0), 10);
  t.ok(circle.containsPoint(Vec2(10, 0)));
  t.end();
});

test('containsPoint() returns false if passed point is outside', function(t) {
  var circle  = new Circle(Vec2(0, 0), 10);
  t.ok(!circle.containsPoint(Vec2(10, 10)));
  t.end();
});

test('containsPoint() handle an array', function(t) {
  var circle  = new Circle(Vec2(0, 0), 10);
  t.ok(circle.containsPoint([10, 0]));
  t.ok(!circle.containsPoint([10, 100]));
  t.end();
});

test('contains() returns false immediately on invalid thing', function(t) {
  var c  = new Circle(Vec2(0, 0), 10);
  t.ok(!c.contains());
  t.ok(!c.contains(null));
  t.end();
});

test('contains() detects concentric circles', function(t) {
  var c  = new Circle(Vec2(0, 0), 10);
  var c2  = new Circle(Vec2(0, 0), 11);

  t.ok(!c.contains(c2));
  t.ok(c2.contains(c));
  t.end()
});

test('contains() does not mutate', function(t) {
  var c  = new Circle(Vec2(10, 10), 10);
  var c2  = new Circle(Vec2(10, 10), 11);

  t.ok(!c.contains(c2));
  t.ok(c2.contains(c));
  t.ok(c.position.equal(Vec2(10, 10)));
  t.ok(c2.position.equal(Vec2(10, 10)));
  t.end();
});

test('contains() detects offset circles', function(t) {
  var c  = new Circle(Vec2(6, 0), 5);
  var c2  = new Circle(Vec2(0, 0), 11);

  t.ok(!c.contains(c2));
  t.ok(c2.contains(c));
  t.end();
});

test('should handle polygon-like things (points function)', function(t) {

  var p = {
    points : function(t) {
      return [
        Vec2(10, 0),
        Vec2(-10, 0),
        Vec2(0, 10),
        Vec2(0, -10)
      ];
    }
  };

  var p2 = {
    points : function(t) {
      return [
        Vec2(10, 100),
        Vec2(-10, 0),
        Vec2(0, 10),
        Vec2(0, -10)
      ];
    }
  };

  var c  = new Circle(Vec2(0, 0), 10);
  t.ok(c.contains(p));
  t.ok(!c.contains(p2));
  t.end();
});

test('should handle polygon-like things (points array)', function(t) {

  var p = {
    points : [
      Vec2(10, 0),
      Vec2(-10, 0),
      Vec2(0, 10),
      Vec2(0, -10)
    ]
  };

  var p2 = {
    points : [
      Vec2(10, 100),
      Vec2(-10, 0),
      Vec2(0, 10),
      Vec2(0, -10)
    ]
  };

  var c  = new Circle(Vec2(0, 0), 10);
  t.ok(c.contains(p));
  t.ok(!c.contains(p2));
  t.end();
});

test('should handle aabb-like things', function(t) {
  var p = {
    x1: -1,
    y1: 0,
    x2: 1,
    y2: 0
  };

  var p2 = {
    x1: -100,
    y1: 0,
    x2: 1,
    y2: 0
  };

  var c  = new Circle(Vec2(0, 0), 10);
  t.ok(c.contains(p));
  t.ok(!c.contains(p2));
  t.end();
});

test('should handle rect-like things (.w/.h)', function(t) {
  var p = {
    x: -5,
    y: -5,
    w: 1,
    h: 1
  };

  var p2 = {
    x: 10,
    y: 0,
    w: 1,
    h: 0
  };

  var c  = new Circle(Vec2(0, 0), 10);
  t.ok(c.contains(p));
  t.ok(!c.contains(p2));
  t.end();
});

test('should handle rect-like things (.w/.h)', function(t) {
  var p = {
    x: -5,
    y: -5,
    width: 1,
    height: 1
  };

  var p2 = {
    x: 10,
    y: 0,
    width: 1,
    height: 0
  };

  var c  = new Circle(Vec2(0, 0), 10);
  t.ok(c.contains(p));
  t.ok(!c.contains(p2));
  t.end();
});

test('area() sanity', function(t) {
  var c = new Circle(null, 1);
  t.ok(Number(c.area()).toFixed(2) === '3.14');
  t.end();
});

test('circumference() sanity', function(t) {
  var c = new Circle(null, 50);
  t.ok(Number(c.circumference()).toFixed(2) === '314.16');
  t.end();
});

test('returns false when no intersections', function(t) {
  var c = Circle(Vec2(0, 0), 10);
  var c2 = Circle(Vec2(21, 0), 10);
  t.ok(!c.intersectCircle(c2));
  t.end()
});

test('returns false when one circle is contained', function(t) {
  var c = Circle(Vec2(0, 0), 10);
  var c2 = Circle(Vec2(0, 0), 20);
  t.ok(!c.intersectCircle(c2));
  t.end();
});

test('returns [] when same circles', function(t) {
  var c = Circle(Vec2(0, 0), 10);
  var c2 = Circle(Vec2(0, 0), 10);
  t.ok(c.intersectCircle(c2).length === 0);
  t.end();
});

test('returns [vec2] when intersects at one point', function(t) {
  var c = Circle(Vec2(0, 0), 10);
  var c2 = Circle(Vec2(20, 0), 10);
  t.ok(c.intersectCircle(c2).equal(10, 0));
  t.end();
});

test('returns [vec2, vec2] when intersects at two points', function(t) {
  var c = Circle(Vec2(0, 0), 10);
  var c2 = Circle(Vec2(10, 0), 10);
  var isect = c2.intersectCircle(c);
  t.ok(isect);
  t.ok(isect.length === 2);

  isect.sort(function(a, b) {
    return a-b;
  });

  t.ok(isect[0].equal(5, -8.66025404));
  t.ok(isect[1].equal(5, 8.66025404));
  t.end();
});

test('toSegments (subdivide into segments)', function(t) {
  var circle = Circle(Vec2(0, 0), 10);
  t.equal(circle.toSegments(4).length, 4);
  t.end();
});
