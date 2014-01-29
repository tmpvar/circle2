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
  });

  describe('#contains', function() {
    it('should detect concentric circles', function() {
      var c  = new Circle(Vec2(0, 0), 10);
      var c2  = new Circle(Vec2(0, 0), 11);

      ok(!c.contains(c2));
      ok(c2.contains(c));
    });

    it('should detect offset circles', function() {
      var c  = new Circle(Vec2(6, 0), 5);
      var c2  = new Circle(Vec2(0, 0), 11);

      ok(!c.contains(c2));
      ok(c2.contains(c));
    });


    it('should handle polygon-like things', function() {

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

      var c  = new Circle(Vec2(0, 0), 10);
      ok(c.contains(p));
    });

    it('should handle polygon-like things', function() {
      var p = {
        points : function() {
          return [
            Vec2(10, 0),
            Vec2(-11, 0),
            Vec2(0, 10),
            Vec2(0, -10)
          ];
        }
      };

      var c  = new Circle(Vec2(0, 0), 10);
      ok(!c.contains(p));
    });

  });
});
