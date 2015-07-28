///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Interactive Components", () => {
  describe("XDragBoxLayer", () => {
    var SVG_WIDTH = 400;
    var SVG_HEIGHT = 400;

    it("bounds()", () => {
      var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var dbl = new Plottable.Components.XDragBoxLayer();
      dbl.boxVisible(true);
      dbl.renderTo(svg);

      var topLeft = {
        x: SVG_WIDTH / 4,
        y: SVG_HEIGHT / 4
      };
      var bottomRight = {
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2
      };

      dbl.bounds({
        topLeft: topLeft,
        bottomRight: bottomRight
      });

      var actualBounds = dbl.bounds();
      assert.strictEqual(actualBounds.topLeft.y, 0, "box starts at top");
      assert.strictEqual(actualBounds.topLeft.x, topLeft.x, "left edge set correctly");
      assert.strictEqual(actualBounds.bottomRight.y, dbl.height(), "box ends at bottom");
      assert.strictEqual(actualBounds.bottomRight.x, bottomRight.x, "right edge set correctly");

      svg.remove();
    });

    it("resizes only in x", () => {
      var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var dbl = new Plottable.Components.XDragBoxLayer();
      dbl.boxVisible(true);
      dbl.resizable(true);
      dbl.renderTo(svg);

      var topLeft = {
        x: SVG_WIDTH / 4,
        y: SVG_HEIGHT / 4
      };
      var bottomRight = {
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2
      };

      dbl.bounds({
        topLeft: topLeft,
        bottomRight: bottomRight
      });

      var actualBounds = dbl.bounds();
      var dragTo = {
        x: SVG_WIDTH * 3 / 4,
        y: SVG_HEIGHT / 2
      };
      var target = dbl.background();
      TestMethods.triggerFakeDragSequence(target, actualBounds.bottomRight, dragTo);
      actualBounds = dbl.bounds();
      assert.strictEqual(actualBounds.bottomRight.x, dragTo.x, "resized in x");
      assert.strictEqual(actualBounds.topLeft.y, 0, "box still starts at top");
      assert.strictEqual(actualBounds.bottomRight.y, dbl.height(), "box still ends at bottom");
      svg.remove();
    });

    it("stays full height after resizing", () => {
      var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var dbl = new Plottable.Components.XDragBoxLayer();
      dbl.boxVisible(true);
      dbl.resizable(true);
      dbl.renderTo(svg);

      var topLeft = {
        x: SVG_WIDTH / 4,
        y: SVG_HEIGHT / 4
      };
      var bottomRight = {
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2
      };

      dbl.bounds({
        topLeft: topLeft,
        bottomRight: bottomRight
      });

      var heightBefore = dbl.height();
      var boundsBefore = dbl.bounds();
      svg.attr("height", 2 * SVG_HEIGHT);
      dbl.redraw();
      assert.notStrictEqual(dbl.height(), heightBefore, "component changed size");

      var boundsAfter = dbl.bounds();
      assert.strictEqual(boundsAfter.topLeft.x, boundsBefore.topLeft.x, "box keeps same left edge");
      assert.strictEqual(boundsAfter.topLeft.y, 0, "box still starts at top");
      assert.strictEqual(boundsAfter.bottomRight.x, boundsBefore.bottomRight.x, "box keeps same right edge");
      assert.strictEqual(boundsAfter.bottomRight.y, dbl.height(), "box still ends at bottom");
      svg.remove();
    });

    it("moves only in x", () => {
      var svg = TestMethods.generateSVG(SVG_WIDTH, SVG_HEIGHT);
      var dbl = new Plottable.Components.XDragBoxLayer();
      dbl.boxVisible(true);
      dbl.movable(true);
      dbl.renderTo(svg);

      var topLeft = {
        x: SVG_WIDTH / 4,
        y: SVG_HEIGHT / 4
      };
      var bottomRight = {
        x: SVG_WIDTH * 3 / 4,
        y: SVG_HEIGHT * 3 / 4
      };

      dbl.bounds({
        topLeft: topLeft,
        bottomRight: bottomRight
      });

      var boundsBefore = dbl.bounds();
      var dragDistance = 10;
      var target = dbl.background();
      TestMethods.triggerFakeDragSequence(target,
        { x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 },
        { x: SVG_WIDTH / 2 + dragDistance, y: SVG_HEIGHT / 2 + dragDistance }
      );

      var boundsAfter = dbl.bounds();
      assert.strictEqual(boundsAfter.topLeft.x, boundsBefore.topLeft.x + dragDistance, "left edge moved");
      assert.strictEqual(boundsAfter.topLeft.y, 0, "box still starts at top");
      assert.strictEqual(boundsAfter.bottomRight.x, boundsBefore.bottomRight.x + dragDistance, "right edge moved");
      assert.strictEqual(boundsAfter.bottomRight.y, dbl.height(), "box still ends at bottom");

      svg.remove();
    });
  });
});
