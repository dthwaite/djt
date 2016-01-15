var assert = require('assert');
require("../public/Life.js");

describe("Life calculator", function() {

    function resetCells(cells) {
        for (var index=0;index<cells.length;index++) {
            cells[index].v=false;
        }
    }

    describe("Basics of setting and resetting cells",function() {
        var life=new GlobalLife(10,10);
        it("Check basic Cell set and get", function() {
            assert.deepEqual(life.cell(5,5),{x:5,y:5,v:false},"Failed to get correct unset value from a cell");
            life.live(5, 5);
            assert.deepEqual(life.cell(5,5),{x:5,y:5,v:true},"Failed to get correct set value from a cell");
            life.die(5,5);
        });

        it("Check that setting/resetting a cell in a 10x10 grid works", function () {
            for (var x = 0; x < 10; x++) {
                for (var y = 0; y < 10; y++) {
                    life.live(x, y);
                    assert.equal(life.value(x, y), true, "Failed to set cell " + x + "," + y);
                    life.die(x, y);
                    assert.equal(life.value(x, y), false, "Failed to reset cell " + x + "," + y);
                    life.toggle(x, y);
                    assert.equal(life.value(x, y), true, "Failed to toggle on cell " + x + "," + y);
                    life.toggle(x, y);
                    assert.equal(life.value(x, y), false, "Failed to toggle off cell " + x + "," + y);
                }
            }
        });

        it("Check a request to retrieve an array of all set cells", function () {
            assert.equal(life.values().length, 0, "Grid should return all unset");
            for (x = 0; x < 10; x += 4) {
                for (y = 0; y < 10; y += 4) {
                    life.live(x, y);
                }
            }
            var cells = life.values();
            assert.equal(cells.length, 9, "Grid should return 9 cells set");
            assert.equal(cells.length, 9, "Grid should return 9 cells set");
            assert.equal(Object.keys(cells[Math.floor(Math.random() * 10)]).length, 3, "Random element should have 3 properties");
            assert.equal(cells[Math.floor(Math.random() * 9)].hasOwnProperty("x"), true, "Random element should have a property 'x'");
            assert.equal(cells[Math.floor(Math.random() * 9)].hasOwnProperty("y"), true, "Random element should have a property 'y'");
            assert.equal(cells[Math.floor(Math.random() * 9)].hasOwnProperty("v"), true, "Random element should have a property 'v'");
            assert.equal(cells[Math.floor(Math.random() * 9)].v, true, "Random element should be set");
        });

        it("Check the application of a set of cells", function () {
            var cells = life.values();
            assert.equal(cells.length, 9, "Grid should return 9 cells set");
            resetCells(cells);
            life.apply(cells);
            assert.equal(life.values(), 0, "Grid should have been fully reset");
        });
    });

    describe("Check various patterns iterate correctly",function() {
        var life = new GlobalLife(10, 10);

        var shapes = {
            block: [[4, 4], [5, 4], [4, 5], [5, 5]],
            x_blinker: [[4, 4], [5, 4], [6, 4]],
            y_blinker: [[5, 3], [5, 4], [5, 5]],
            glider_1: [[5, 4], [6, 5], [4, 6], [5, 6], [6, 6]],
            glider_2: [[4, 5], [6, 5], [5, 6], [6, 6], [5, 7]],
            glider_3: [[6, 5], [4, 6], [6, 6], [5, 7], [6, 7]],
            glider_4: [[5, 5], [6, 6], [7, 6], [5, 7], [6, 7]],
            glider_5: [[6, 5], [7, 6], [5, 7], [6, 7], [7, 7]]
        };

        // Sets a pattern from a list of set cells into the grid
        function setPattern(pattern) {
            var cells = [];
            for (var coord in shapes[pattern]) cells.push({
                x: shapes[pattern][coord][0],
                y: shapes[pattern][coord][1],
                v: true
            });
            life.apply(cells);
            return cells;
        }

        // Checks the set of cells to equate the shape provided
        function checkPattern(cells, pattern) {
            if (cells.length != shapes[pattern].length) return false;
            for (var index1 in cells) {
                var cell = cells[index1];
                var found = false;
                for (var index2 in shapes[pattern]) {
                    var coord = shapes[pattern][index2];
                    if (cell.x == coord[0] && cell.y == coord[1] && cell.v) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false;
            }
            return true;
        }

        beforeEach("Clears out the grid", function () {
            var cells = life.values();
            resetCells(cells);
            life.apply(cells);
        });

        it("Checks the BLOCK pattern does not change after an iteration", function () {
            var before=setPattern("block");
            var changes = life.iterate();
            var after = life.values();
            assert.equal(changes.length, 0, "Expected no cell changes for a BLOCK");
            assert.equal(before.length, after.length, "Expected the same number of cells to be set before and after for a BLOCK");
            assert.equal(checkPattern(after, "block"), true, "Expected the same BLOCK after an iteration");
        });

        it("Checks the BLINKER pattern behaves as expected", function () {
            var before=setPattern("x_blinker");
            var changes = life.iterate();
            var after = life.values();
            assert.equal(changes.length, 4, "Expected 4 cell changes for a BLINKER, 1st iteration");
            assert.equal(before.length, after.length, "Expected the same number of cells to be set before and after for a BLINKER, 1st iteration");
            assert.equal(checkPattern(after, "y_blinker"), true, "Expected a new BLINKER pattern after an iteration, 1st iteration");
            var changes = life.iterate();
            after = life.values();
            assert.equal(changes.length, 4, "Expected 4 cell changes for a BLINKER, 2nd iteration");
            assert.equal(before.length, after.length, "Expected the same number of cells to be set before and after for a BLINKER, 2nd iteration");
            assert.equal(checkPattern(after, "x_blinker"), true, "Expected a new BLINKER pattern after an iteration, 2nd iteration");
        });

        it("Checks the GLIDER pattern behaves as expected - 4 iterations to same shape",function() {
            var before=setPattern("glider_1");
            var changes = life.iterate();
            var after = life.values();
            assert.equal(checkPattern(after, "glider_2"), true, "Expected 2nd iteration GLIDER");
            var changes = life.iterate();
            var after = life.values();
            assert.equal(checkPattern(after, "glider_3"), true, "Expected 3rd iteration GLIDER");
            var changes = life.iterate();
            var after = life.values();
            assert.equal(checkPattern(after, "glider_4"), true, "Expected 4th iteration GLIDER");
            var changes = life.iterate();
            var after = life.values();
            assert.equal(checkPattern(after, "glider_5"), true, "Expected 5th iteration GLIDER");
        });
    });
});