describe("LifeIO tests", function() {
    var lp; // DJT.classes.LifePatterns class
    var iteration=0; // Track the number of iteration so a test Life game
    var io; // DJT.classes.ServerIO class
    var io2;// ditto
    var io3;// ditto
    var cellChecker=null; // Function on a per test basis to check cell changes are as expected from server
    var nullfunc=function() {};
    function cellChanges(cells) {
        if (cellChecker) {
            cellChecker(cells);
            cellChecker=null;
        }
    }

    it("wait for document ready",function(done) {
        lp=DJT.classes.LifePatterns;
        $(done);
    });

    describe("ServerIO implementation",function() {

        it("should create a new life with an id",function(done) {
            function idChange(id) {
                expect(id).toBeDefined();
                expect(io.iteration).toEqual(0);
                done();
            }

            io=new DJT.classes.ServerIO(idChange);
            io.init(50,50,cellChanges);
        });


        it("should receive a block shape having applied one",function (done) {
            cellChecker=function(cells) {
                expect(lp.checkPattern(cells,"block")).toEqual(true);
                expect(io.iteration).toEqual(1);
                done();
            };
            io.apply(lp.getPattern("block"));
        });

        it("should stop the server iterating due to stopping the subscription",function(done) {
            io.apply(lp.getPattern("glider_1",10,10));
            Meteor.setTimeout(function() {
                io.stop();
                var iteration=io.iteration;
                Meteor.setTimeout(function() {
                    expect(io.iteration).toEqual(iteration);
                    done();
                },1000)
            },1000);
        });

        it("on recovery of an existing life, it should have the correct dimensions",function(done) {
            io2=new DJT.classes.ServerIO(nullfunc);
            function sizeChange(width,height) {
                expect(width).toEqual(50);
                expect(height).toEqual(50);
                done();
            }
            io2.restore(io.id,sizeChange,nullfunc);
        });

        it("on recovery of an existing life, it should have continued to iterate",function(done) {
            io3=new DJT.classes.ServerIO();
            var iteration=io.iteration;
            io3.restore(io.id,nullfunc,function(cells) {
                if (io3.iteration>iteration) done();
            });
        });

        it("iteration count for ongoing subscription should be greater than stopped subscription",function(done) {
            io2.stop();
            Meteor.setTimeout(function() {
                expect(io.iteration).toBeGreaterThan(io2.iteration);
                done();
            },1000);
        });
    });

    describe("WorkerIO implementation",function() {
        it("should create a new life providing an id and the block shape applied",function(done) {
            var funcs= {
                idChange: function (id) {
                    expect(id).toBeDefined();
                    expect(io.iteration).toEqual(0);
                }
            };
            cellChecker=function (cells) {
                expect(funcs.idChange).toHaveBeenCalled();
                expect(lp.checkPattern(cells,"block",15,15)).toEqual(true);
                expect(io.iteration).toEqual(1);
                done();
            };
            spyOn(funcs,"idChange").and.callThrough();
            io=new DJT.classes.WorkerIO(DJT.lifeworker,funcs.idChange);
            io.init(20,20,cellChanges);
            io.apply(lp.getPattern("block",15,15));
        });

        it("checks the Life game iterates at least 10 times having applied a glider",function() {
            var counter=0;
            cellChecker=function (cells) {
                counter++;
                if (counter==10) done();
            };
            io.apply(lp.getPattern("glider_1",10,10));
        });

        it("should resize the Life game resulting in no cells set",function() {
            cellChecker=function (cells) {
                expect(cells.length).toEqual(0);
                done();
            };
            io.resize(10,10);
        });

        it("should be able to apply a new shape in a resized Life game",function() {
            cellChecker=function (cells) {
                expect(lp.checkPattern(cells,"block",5,5)).toEqual(true);
                done();
            };
            io.apply(lp.getPattern("block",5,5));
        });
    });
});