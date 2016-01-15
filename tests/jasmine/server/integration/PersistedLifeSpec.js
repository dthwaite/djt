describe("Class: PersistedLife ... Tests the persistence of a Life game",function() {
    var game1=null;
    var game2=null;
    var subscriptionId1="subid1";
    var subscriptionId2="subid2";

    var async=(function() {
        function A() {
            this.callback=null;
        }
        A.prototype.trigger=function(param) {
            if (this.callback) {
                this.callback(param);
                this.callback=null;
            }
        };
        A.prototype.done=function(callback) {
            this.callback=callback;
        };
        return new A();
    })();


    beforeAll(function() {
        DJT.mongo.games.find().forEach(function(game) {
            DJT.mongo.games.remove(game._id);
        });
        DJT.mongo.changes.find().forEach(function(change) {
            DJT.mongo.changes.remove(change._id);
        });
    });

    beforeEach(function() {
        var spy=spyOn(DJT.mongo.games,"insert").and.callThrough();
    });

    it("1. should create a new PersistedLife object",function(done) {
        var id=DJT.classes.ServerLives.createLife(100,100);
        Meteor.setTimeout(function() {
            game1=DJT.classes.ServerLives.getLife(id);
            expect(game1.serverId).toEqual(id);
            expect(DJT.mongo.games.insert).toHaveBeenCalled();
            done();
        },10);
    });
    it("2. should persist, read and apply a block shape",function() {
        game1.persist(DJT.classes.LifePatterns.getPattern("block"));
        game1.catchup();
        expect(game1.iteration).toEqual(1);
        expect(DJT.classes.LifePatterns.checkPattern(game1.values(),"block")).toBeTruthy();
    });
    it("3. should now only have 1 running game",function() {
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(1);
    });
    it("4. should now have no running games after an iteration",function() {
        game1.iterate();
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(0);
    });
    it("5. should create a second PersistedLife game that is running",function() {
        var id=DJT.classes.PersistedLife.createGame(100,100);
        game2=new DJT.classes.PersistedLife(100,100,id);
        game2.persist(DJT.classes.LifePatterns.getPattern("block"));
        game2.catchup();
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(1);
    });
    it("6. should still have 1 running game having applied a shape already there",function() {
        game1.apply(DJT.classes.LifePatterns.getPattern("block"));
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(1);
    });
    it("7. should have 2 running games having applied a shape elsewhere",function() {
        game1.apply(DJT.classes.LifePatterns.getPattern("block",10,10));
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(2);
    });
    it("8. should have both games paused having iterated them",function() {
        game1.iterate();
        game2.iterate();
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(0);
    });
    it("9. should have 1 running game having subscribed to it",function() {
        game1.setSubscription(subscriptionId1);
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(1);
    });
    it("10. should have no running game having unsubscribed to it",function() {
        game1.unsetSubscription(subscriptionId1);
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(0);
    });
    it("11. should have no running game having subscribed and iterated",function() {
        game1.setSubscription(subscriptionId1);
        game1.iterate();
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(0);
    });
    it("12. should have one running game having twice subscribed",function() {
        game1.setSubscription(subscriptionId1);
        game1.setSubscription(subscriptionId2);
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(1);
    });
    it("13. should still have one running game having unsubscribed once",function() {
        game1.unsetSubscription(subscriptionId1);
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(1);
    });
    it("14. should have no running games having unsubscribed the other",function() {
        game1.unsetSubscription(subscriptionId2);
        expect(DJT.classes.PersistedLife.getRunningGames().count()).toEqual(0);
    });

});