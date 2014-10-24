## circle2

## install

```
npm install circle2
```

## use


new __Circle__([origin [, radius])

Where `origin` adheres to the following form:

 * `[0, 1]`
 * `{ x: 0, y: 1}`

and `radius` is a number

_Note:_ the arguments to the `Circle` function are optional. If none are passed `circle.position` will be `0, 0` and `circle.radius` will be `1`

You can also pass in a 3 points and have the circle computed from them:

```javascript

var circle = Circle([
  [0, 0],
  [10, 0],
  [0, 10]
])

console.log(circle.radius()); // 10
console.log(circle.position); // { x: 0, y: 0 }

```

or an 3-item array of `Vec2`

```javascript

var circle = Circle([
  Vec2(0, 0),
  Vec2(10, 0),
  Vec2(0, 10)
])

console.log(circle.radius()); // 10
console.log(circle.position); // { x: 0, y: 0 }

```

_Note:_ changing the passed `Vec2`s will change the circle


### Instance Methods

__radius__([newRadius])

Get/Set the radius of the circle

__containsPoint__(point)

Where `point` looks like one of the following:

 * `[0, 1]`
 * `{ x: 0, y: 1 }`
 * `new Vec2(0, 1)`

This function will return `true` if the passed point is inside or right on the boundary of the circle.

```javascript
var Circle = require('circle2');

var c = Circle()

console.log(c.contains([10, 0])) // false

c.radius(10);

console.log(c.contains([10, 0])); // true
```

__contains__(thing)

Where `thing` meets the following criteria:

 * has `.position` and `.radius()` - _circle_
 * has a function `.points()` or array `.points` - _polygon_
 * has `.x1`, `.y1`, `.x2`, and `.y2` - _rectangle_
 * has `.x`, `.y`, `.w`, and `.h` - _rectangle_
 * has `.x`, `.y`, `.width`, and `.height` - _rectangle_

This method will return `true` if the passed `thing` is completely inside, and false otherwise.

```javascript
var Circle = require('circle2');

var center = [0, 0];

var c = new Circle(center, 10)
var c2 = new Circle(center, 5)

console.log(c.contains(c2)); // true
```

_Note_: if the points of `thing` are on the circumference of the circle, this method will return `true`

__change__(fn)

This is a method that you want to have called any time the circle changes.  Either in `radius` or `position`

```javascript
var c = new Circle();

var trackCircleRadius = c.change(function(circle) {
  // do stuff. c === circle
});

c.radius(10); // this will call `trackCircleRadius`
```

__ignore__([fn])

Takes an optional `fn` parameter which if passed will remove the specified listener.

If no `fn` is passed, _all_ the listeners will be removed.

__notify__()

Force listeners to be called.

__area__()

Returns the area `PI * r^2`

__circumference__()

Returns the circumference `PI * r*2`

__intersectCircle__(circle)

Performs an intersection between this circle and the incoming. Results are as follows:

 * `false` - no intersection or one circle is contained in the other
 * `[]` - same circles
 * `[Vec2]` - single intersection
 * `[Vec2, Vec2]` - two intersection points

__toSegments__([segments])

Convert this circle into a series of points representing the outline of this circle


### license

MIT (see: [license.txt](blob/master/license.txt))
