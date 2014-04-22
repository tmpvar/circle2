var Circle, Vec2;
if (typeof require !== "undefined") {
  Circle = require("../circle2.js");
  Vec2 = require("vec2");
} else {
  Circle = window.Circle;
  Vec2 = window.Vec2;
}

var ok = function(a, msg) { if (!a) throw new Error(msg || "not ok"); };

describe('circle2', function() {
  describe('ctor', function() {
    it('should take a point and radius', function() {
      var circle = new Circle(Vec2(0, 0), 10);
      ok(circle.radius() === 10);
    });

    it('should have sane defaults', function() {
      var circle = new Circle();
      ok(circle.position.equal(Vec2(0, 0)));
      ok(circle.radius() === 1);
    });

    it('should create a Circle without the new keyword', function() {
      var circle = Circle(Vec2(1, 1));
      ok(circle.position.equal(Vec2(1, 1)));
    });

    // TODO: 2 and 3 point circles
  });

  describe('#change', function() {
    it('should notify listeners', function(t) {
      var c = new Circle();
      c.change(function(obj) {
        ok(obj === c);
        t();
      });
      c.notify();
    });

    it('should return the passed function', function() {
      var c = new Circle();
      ok(true === c.change(true));
    });

  });

  describe('#ignore', function() {
    it('should remove a listener', function() {
      var c = new Circle(), called = false;

      var fn = function(obj) {
        called = true;
      };

      c.change(fn);
      c.ignore(fn);
      c.notify();

      ok(!called);
    });

    it('should remove all listeners when a fn is not passed', function() {
      var c = new Circle(), called = false;

      var fn = function(obj) {
        called = true;
      };

      c.change(fn);
      c.ignore();
      c.notify();

      ok(!called);
    });
  });

  describe('#radius', function() {
    it('should act as a getter and a setter', function() {
      var circle  = new Circle();

      circle.radius(10);
      ok(circle.radius() === 10);

      circle.radius(5.45);
      ok(circle.radius() === 5.45);
    });

    it('should notify when changed', function(t) {
      var circle  = new Circle();
      circle.change(function() {
        t();
      });

      circle.radius(10);
    });

    it('should clean incoming values', function() {
      var circle  = new Circle();
      circle.radius(0.1 + 0.2);
      ok(circle.radius() === 0.3);
    });
  });

  describe('#containsPoint', function() {
    it('should return true if passed point is inside', function() {
      var circle  = new Circle(Vec2(0, 0), 10);

      ok(circle.containsPoint(Vec2(0, 0)));
    });

    it('should return true if passed point is on the boundary', function() {
      var circle  = new Circle(Vec2(0, 0), 10);
      ok(circle.containsPoint(Vec2(10, 0)));
    });

    it('should return false if passed point is outside', function() {
      var circle  = new Circle(Vec2(0, 0), 10);
      ok(!circle.containsPoint(Vec2(10, 10)));
    });

    it('should handle an array', function() {
      var circle  = new Circle(Vec2(0, 0), 10);
      ok(circle.containsPoint([10, 0]));
      ok(!circle.containsPoint([10, 100]));
    })

  });

  describe('#contains', function() {
    it('should return false immediately on invalid thing', function() {
      var c  = new Circle(Vec2(0, 0), 10);
      ok(!c.contains());
      ok(!c.contains(null));
    });


    it('should detect concentric circles', function() {
      var c  = new Circle(Vec2(0, 0), 10);
      var c2  = new Circle(Vec2(0, 0), 11);

      ok(!c.contains(c2));
      ok(c2.contains(c));
    });

    it('should not mutate either position', function() {
      var c  = new Circle(Vec2(10, 10), 10);
      var c2  = new Circle(Vec2(10, 10), 11);

      ok(!c.contains(c2));
      ok(c2.contains(c));
      ok(c.position.equal(Vec2(10, 10)));
      ok(c2.position.equal(Vec2(10, 10)));
    });

    it('should detect offset circles', function() {
      var c  = new Circle(Vec2(6, 0), 5);
      var c2  = new Circle(Vec2(0, 0), 11);

      ok(!c.contains(c2));
      ok(c2.contains(c));
    });

    it('should handle polygon-like things (points function)', function() {

      var p = {
        points : function() {
          return [
            Vec2(10, 0),
            Vec2(-10, 0),
            Vec2(0, 10),
            Vec2(0, -10)
          ];
        }
      };

      var p2 = {
        points : function() {
          return [
            Vec2(10, 100),
            Vec2(-10, 0),
            Vec2(0, 10),
            Vec2(0, -10)
          ];
        }
      };

      var c  = new Circle(Vec2(0, 0), 10);
      ok(c.contains(p));
      ok(!c.contains(p2));
    });

    it('should handle polygon-like things (points array)', function() {

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
      ok(c.contains(p));
      ok(!c.contains(p2));
    });

    it('should handle aabb-like things', function() {
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
      ok(c.contains(p));
      ok(!c.contains(p2));
    });

    it('should handle rect-like things (.w/.h)', function() {
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
      ok(c.contains(p));
      ok(!c.contains(p2));
    });

    it('should handle rect-like things (.w/.h)', function() {
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
      ok(c.contains(p));
      ok(!c.contains(p2));
    });
  });

  describe('#area', function() {
    it('should return the correct area', function() {
      var c = new Circle(null, 1);
      ok(Number(c.area()).toFixed(2) === '3.14');
    });
  });

  describe('#circumference', function() {
    it('should return the correct value', function() {
      var c = new Circle(null, 50);
      ok(Number(c.circumference()).toFixed(2) === '314.16');
    });
  });

  describe('#intersectCircle', function() {
    it('returns false when no intersections', function() {
      var c = Circle(Vec2(0, 0), 10);
      var c2 = Circle(Vec2(21, 0), 10);
      ok(!c.intersectCircle(c2));
    });

    it('returns false when one circle is contained', function() {
      var c = Circle(Vec2(0, 0), 10);
      var c2 = Circle(Vec2(0, 0), 20);
      ok(!c.intersectCircle(c2));
    });

    it('returns [] when same circles', function() {
      var c = Circle(Vec2(0, 0), 10);
      var c2 = Circle(Vec2(0, 0), 10);
      ok(c.intersectCircle(c2).length === 0);
    });

    it('returns [vec2] when intersects at one point', function() {
      var c = Circle(Vec2(0, 0), 10);
      var c2 = Circle(Vec2(20, 0), 10);
      ok(c.intersectCircle(c2).equal(10, 0));
    });

    it('returns [vec2, vec2] when intersects at two points', function() {
      var c = Circle(Vec2(0, 0), 10);
      var c2 = Circle(Vec2(10, 0), 10);
      var isect = c2.intersectCircle(c);
      ok(isect);
      ok(isect.length === 2);

      isect.sort(function(a, b) {
        return a-b;
      });

      ok(isect[0].equal(5, -8.66025404));
      ok(isect[1].equal(5, 8.66025404));
    });
  });

});
