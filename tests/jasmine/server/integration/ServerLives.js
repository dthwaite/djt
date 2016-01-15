describe("Class: ServerLives ... tests the highlevel server API the client uses",function() {
    var id;
    var sl=DJT.classes.ServerLives;
    var lp=DJT.classes.LifePatterns;

    it("should throw 'bad-life-id' error for invalid get life",function() {
        expect(function() { sl.getLife("badlifeid");}).toThrow();
    });
    it("should throw 'bad-life-id' error for invalid restore life",function() {
        expect(function() { sl.restoreLife("badlifeid");}).toThrow();
    });
    it("should create a 10x10 life",function() {
        id=sl.createLife(10,10);
        var life=sl.getLife(id);
        expect(life.serverId).toEqual(id);
        expect(life.getDimensions()).toEqual({width:10,height:10});
    });
    it("should apply a glider into a life",function() {
        sl.lifeUpdate(id,lp.getPattern("glider_1"));
        expect(lp.checkPattern(sl.getLife(id).values(),"glider_1")).toEqual(true);
    });
    it("should iterate a glider 3 times in a life game",function() {
        var life=sl.getLife(id);
        for (var i=0;i<3;i++) life.iterate();
        expect(lp.checkPattern(life.values(),"glider_4")).toEqual(true);
    });
    it("should restore the previous life game",function() {
        sl.clear();
        expect(sl.restoreLife(id)).toEqual({width:10,height:10});
        expect(lp.checkPattern(sl.getLife(id).values(),"glider_4")).toEqual(true);
    });
    it("should iterate two lives",function() {
        var id2=sl.createLife(10,10);
        sl.lifeUpdate(id2,lp.getPattern("glider_1"));
        var life1=sl.getLife(id);
        var life2=sl.getLife(id2);
        sl.iterateLives();
        expect(lp.checkPattern(life2.values(),"glider_2")).toEqual(true);
        expect(lp.checkPattern(life1.values(),"glider_5")).toEqual(true);

    });

});