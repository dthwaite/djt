describe("Class: Life", function() {

    function resetCells(cells) {
        for (var index=0;index<cells.length;index++) {
            cells[index].v=false;
        }
    }

    describe("Basics of setting and resetting cells",function() {
        var life=new DJT.classes.Life(10,10);
        it("Check basic Cell set and get", function() {
            expect(life.cell(5,5)).toEqual({x:5,y:5,v:false});
            life.live(5, 5);
            expect(life.cell(5,5)).toEqual({x:5,y:5,v:true});
            life.die(5,5);
        });

        it("Check that setting/resetting a cell in a 10x10 grid works", function () {
            for (var x = 0; x < 10; x++) {
                for (var y = 0; y < 10; y++) {
                    life.live(x, y);
                    expect(life.value(x, y)).toEqual(true);
                    life.die(x, y);
                    expect(life.value(x, y)).toEqual(false);
                    life.toggle(x, y);
                    expect(life.value(x, y)).toEqual(true);
                    life.toggle(x, y);
                    expect(life.value(x, y)).toEqual(false);
                }
            }
        });

        it("Check a request to retrieve an array of all set cells", function () {
            expect(life.values().length).toEqual(0);
            for (x = 0; x < 10; x += 4) {
                for (y = 0; y < 10; y += 4) {
                    life.live(x, y);
                }
            }
            var cells = life.values();
            expect(cells.length).toEqual(9);
            expect(cells.length).toEqual(9);
            expect(Object.keys(cells[Math.floor(Math.random() * 10)]).length).toEqual(3);
            expect(cells[Math.floor(Math.random() * 9)].hasOwnProperty("x")).toEqual(true);
            expect(cells[Math.floor(Math.random() * 9)].hasOwnProperty("y")).toEqual(true);
            expect(cells[Math.floor(Math.random() * 9)].hasOwnProperty("v")).toEqual(true);
            expect(cells[Math.floor(Math.random() * 9)].v).toEqual(true);
        });

        it("Check the application of a set of cells", function () {
            var cells = life.values();
            expect(cells.length).toEqual(9);
            resetCells(cells);
            life.apply(cells);
            expect(life.values().length).toEqual(0);
        });
    });

    describe("Check various patterns iterate correctly",function() {
        var life = new DJT.classes.Life(10, 10);

        beforeEach(function () {
            var cells = life.values();
            resetCells(cells);
            life.apply(cells);
        });

        it("Checks the BLOCK pattern does not change after an iteration", function () {
            var before=DJT.classes.LifePatterns.setPattern(life,"block");
            var changes = life.iterate();
            var after = life.values();
            expect(changes.length).toEqual(0);
            expect(before.length).toEqual(after.length);
            expect(DJT.classes.LifePatterns.checkPattern(after, "block")).toEqual(true);
        });

        it("Checks the BLINKER pattern behaves as expected", function () {
            var before=DJT.classes.LifePatterns.setPattern(life,"x_blinker");
            var changes = life.iterate();
            var after = life.values();
            expect(changes.length).toEqual(4);
            expect(before.length).toEqual(after.length);
            expect(DJT.classes.LifePatterns.checkPattern(after, "y_blinker")).toEqual(true);
            var changes = life.iterate();
            after = life.values();
            expect(changes.length).toEqual(4);
            expect(before.length).toEqual(after.length);
            expect(DJT.classes.LifePatterns.checkPattern(after, "x_blinker")).toEqual(true);
        });

        it("Checks the GLIDER pattern behaves as expected - 4 iterations to same shape",function() {
            var before=DJT.classes.LifePatterns.setPattern(life,"glider_1");
            var changes = life.iterate();
            var after = life.values();
            expect(DJT.classes.LifePatterns.checkPattern(after, "glider_2")).toEqual(true);
            var changes = life.iterate();
            var after = life.values();
            expect(DJT.classes.LifePatterns.checkPattern(after, "glider_3")).toEqual(true);
            var changes = life.iterate();
            var after = life.values();
            expect(DJT.classes.LifePatterns.checkPattern(after, "glider_4")).toEqual(true);
            var changes = life.iterate();
            var after = life.values();
            expect(DJT.classes.LifePatterns.checkPattern(after, "glider_5")).toEqual(true);
        });
    });
});