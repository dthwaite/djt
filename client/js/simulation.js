/**
 * @file Highway Simulation
 * @author Dominic Thwaites
 */

DJT.classes.Simulation=(function() {
    /****************************************************************************************************************
     * LANE class
     ****************************************************************************************************************/
    Simulation.prototype.Lane=(function() {
        var id=1;

        var Lane=function(speed,distance) {
            this.id=id++;
            this.distance=distance;
            this.speed=speed;
            this.deadend=false;
            this.joins={
                before:null,
                after:null,
                left:{
                    lane:null,
                    start:0
                },
                right:{
                    lane:null,
                    start:0
                }
            }
        };

        Lane.prototype.nextId=this.nextLaneId;

        Lane.prototype.join=function(lane) {
            lane.joins.before=this;
            this.joins.after=lane;
            this.deadend=false;
            return lane;
        };

        Lane.prototype.adjoin=function(lane,position) {
            lane.joins.left.lane=this;
            lane.joins.left.start=position;
            this.joins.right.lane=lane;
            this.joins.right.start=-position;
        };

        Lane.prototype.terminate=function() {
            this.deadend=true;
        };

        Lane.prototype.distanceBehind=function(lane,distance) {
            if (lane==null) return Infinity;
            if (this.id==lane.id) return distance;
            return this.distanceBehind(lane.joins.after,distance+lane.distance);
        };

        Lane.prototype.distanceToend=function(distance) {
            distance+=this.distance;
            if (this.joins.after) return this.joins.after.distanceToend(distance);
            return distance;
        };

        return Lane;
    })();

    function randomNumber() {
        return Math.random();
    }
    function gaussRandom(mean,sd) {
        var u = 2*randomNumber()-1;
        var v = 2*randomNumber()-1;
        var r = u*u + v*v;
        /*if outside interval [0,1] start over*/
        if(r == 0 || r > 1) return gaussRandom(mean,sd);

        var c = Math.sqrt(-2*Math.log(r)/r);
        var result=mean+sd*u*c;
        if (typeof result == 'undefined') {
            console.log("eh");
        }
        return result;
    }

    function probabilityIndex(distribution) {
        var probability=0;
        var test=randomNumber();
        for (var i=0;probability<test;i++) probability+=distribution[i];
        return i+1;
    }

    /**
     * System works on scales of meters and seconds
     *
     * Rough equivalents are
     * M/S  Mph     Kmh
     * 5    11      18
     * 10   22      36
     * 15   33      54
     * 20   45      72
     * 25   56      90
     * 30   67      108
     * 35   78      126
     * 40   90      144
     *
     * Each iteration is 1 second of time
     */

    // The probability distribution of vehicle size (increments by one meter per value - i.e. vehicles are from 3-10 meters long)
    var VEHICLE_SIZES=[0,0,0.05,0.50,0.70,0.80,0.85,0.90,0.95,1];
    // Distribution of acceleration values expected for all vehicles - in meters per second per second
    var MEAN_ACCELERATION=2;
    var SD_ACCELERATION=0.25;
    // Distribution of deceleration values expected for all vehicles - in meters per second per second
    var MEAN_DECELERATION=3;
    var SD_DECELERATION=0.5;
    var MAX_DECELERATION_MULTIPLE=3; // Deceleration can be 3 times the standard applied for any vehicle for emergencies
    // The % of lane speed that is the SD of the normally distributed car speeds around the mean which is the lane speed
    var SD_PREFERREDSPEED=15;
    // Frequency to check for a desired lane change
    var MEAN_LANECHANGE_FREQ=10;
    var SD_LANECHANGE_FREQ=3;

    function Simulation() {
        this.vehicleId = 1;
        this.iteration=0;
        this.vehicles=[];
        var simulation=this;

        Simulation.prototype.nextVehicleId = function () {
            return this.vehicleId++;
        };

        Simulation.prototype.getIteration = function () {
            return this.iteration;
        };

        /****************************************************************************************************************
         * VEHICLE class
         ****************************************************************************************************************/
        this.Vehicle = function (lane) {
            if (lane.joins.before!=null) throw new Error("Cannot add vehicle due to lane following on from a previous lane");
            this.id = simulation.nextVehicleId();
            var nextObstruction=simulation.findNextObstruction(lane,0,0);
            if (nextObstruction.distance == 0) throw new Error("Cannot add vehicle at a place where there already is one");
            this.situation = new Array(2);
            this.situation[simulation.iteration % 2] = {
                lane:lane,
                speed:0,
                position:0,
                desiredSpeed:gaussRandom(lane.speed,SD_PREFERREDSPEED*lane.speed/100)
            };
            this.size = probabilityIndex(VEHICLE_SIZES);
            this.acceleration = gaussRandom(MEAN_ACCELERATION,SD_ACCELERATION);
            this.deceleration = gaussRandom(MEAN_DECELERATION,SD_DECELERATION);
            this.iteration=simulation.iteration-1;
            this.status=0;// 0=ready to start,1=travelling,2=disabled, 3=driven out
            this.progress=0;
            this.checklane=1/(1+Math.round(gaussRandom(MEAN_LANECHANGE_FREQ,SD_LANECHANGE_FREQ)));
        };


        this.Vehicle.prototype.step=function(priorObstruction,nextObstruction) {
            var me=this;
            this.situation[(simulation.iteration + 1) % 2]=_.clone(this.currentSituation());
            if (this.status==3 || this.status==2) return; // Ignore vehicles that have driven out of the system
            if (this.status==0) this.status=1;
            //this.log();
            this.iteration=simulation.iteration;
            var situation= this.currentSituation();
            var newSituation=this.newSituation();
            var changeInPosition = situation.speed;
            newSituation.speed=Math.max(0,getNewSpeed(nextObstruction,situation.desiredSpeed));

            // Check to see if we want to change lanes
            if (randomNumber()<this.checklane*(situation.desiredSpeed/situation.speed) && situation.lane) {
                if (!considerLaneChange(situation.lane.joins.left,1)) considerLaneChange(situation.lane.joins.right,1.05);
            }

            newSituation.position+=changeInPosition;
            while (newSituation.lane != null && !newSituation.lane.deadend && newSituation.position > newSituation.lane.distance) {
                newSituation.position -= newSituation.lane.distance;
                newSituation.lane = newSituation.lane.joins.after;
                if (newSituation.lane==null) {
                    this.status=3;
                }
                else newSituation.desiredSpeed=gaussRandom(situation.lane.speed,SD_PREFERREDSPEED*situation.lane.speed/100);
            }
            if (nextObstruction.distance-changeInPosition<0) {
                if (nextObstruction.distance-changeInPosition<-me.size) me.status=2;
                changeInPosition=nextObstruction.distance;
            }

            this.progress=changeInPosition;
            return;

            function considerLaneChange(lane,advantage) {
                if (lane.lane) {
                    var nextObstruction = simulation.findNextObstruction(lane.lane, situation.position - lane.start,0);
                    var desiredSpeed = situation.desiredSpeed*lane.lane.speed/situation.lane.speed;
                    var newSpeed = getNewSpeed(nextObstruction, desiredSpeed);
                    if (newSpeed > newSituation.speed*advantage && nextObstruction.distance > situation.speed) {
                        var nextToMe = newLanePosition(lane.lane, situation.position - lane.start);
                        if (nextToMe.lane) {
                            var priorObstruction = simulation.findPreviousObstruction(nextToMe.lane, nextToMe.position,0);
                            if (priorObstruction.distance > situation.speed * 3) {
                                newSituation.lane = nextToMe.lane;
                                newSituation.desiredSpeed = desiredSpeed;
                                newSituation.position=nextToMe.position;
                                newSituation.speed=newSpeed;
                                console.log("Vehicle "+me.id+" changed lane");
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            function newLanePosition(lane,position) {
                if (lane==null) return {position:undefined,lane:lane};
                if (position>lane.distance) return newLanePosition(lane.joins.after,position-lane.distance);
                if (position<0) return newLanePosition(lane.joins.before,position+lane.distance);
                return {position:position,lane:lane};
            }

            function getNewSpeed(infront,desiredSpeed) {
                var newSpeed = 0;
                if (me.status < 2) {
                    if (infront.distance==Infinity) {
                        newSpeed = Math.min(Math.max(desiredSpeed, situation.speed - me.deceleration), situation.speed + me.acceleration);
                    } else {
                        var stopPoint=infront.distance-me.size;
                        var timeToCollision = infront.distance / situation.speed;
                        if (infront.vehicle) {
                            if (infront.vehicle.currentSituation().speed >= situation.speed) timeToCollision = Infinity;
                            else {
                                stopPoint-=(infront.vehicle.size*(1+1.5*randomNumber())+2);
                                timeToCollision = (stopPoint + infront.vehicle.currentSituation().speed) / (situation.speed - infront.vehicle.currentSituation().speed / 4);
                            }
                        }
                        var timeToStop = situation.speed / me.deceleration;
                        timeToCollision--;
                        var requiredSpeed = timeToCollision * me.deceleration;
                        if (timeToStop < timeToCollision) {
                            newSpeed = Math.min(Math.max(desiredSpeed, situation.speed - me.deceleration), situation.speed + Math.min(me.acceleration, infront.distance - 1));
                        }
                        else {
                            newSpeed = Math.max(requiredSpeed, situation.speed - me.deceleration * MAX_DECELERATION_MULTIPLE);
                        }
                    }
                }
                return newSpeed;
            }
        };

        this.Vehicle.prototype.currentSituation = function () {
            return this.situation[simulation.iteration % 2];
        };
        this.Vehicle.prototype.newSituation = function () {
            return this.situation[(simulation.iteration+1) % 2];
        };

        this.Vehicle.prototype.stop=function() {
            this.currentSituation().speed=0;
        };

        this.Vehicle.prototype.disabled=function() {
            this.status=2;
            console.log("Vehicle " + this.id+" disabled");
        };

        this.Vehicle.prototype.log = function () {
            switch(this.status) {
                case 0:
                    console.log("Vehicle " + this.id+" Initialised");
                    break;
                case 1:
                    console.log("Vehicle " + this.id + ": lane=" + this.currentSituation().lane.id + " position=" + this.currentSituation().position + " speed=" + this.currentSituation().speed);
                    break;
                case 2:
                    console.log("Vehicle " + this.id+" Disabled");
                    break;
                case 3:
                    console.log("Vehicle " + this.id+" Off road");
                    break;

            }
        };
    }

    Simulation.prototype.findNextObstruction=function(lane,position,distance) {
        if (lane==null) return {distance: Infinity, vehicle: null};
        var nextVehicle=null;
        this.vehicles.forEach(function(vehicle) {
            if (vehicle.status<3 && vehicle.currentSituation().lane.id==lane.id && vehicle.currentSituation().position>=position) {
                if (nextVehicle==null || nextVehicle.currentSituation().position>vehicle.currentSituation().position) nextVehicle=vehicle;
            }
        });
        if (nextVehicle==null) {
            if (lane.deadend) return {distance: Math.max(0,distance + lane.distance - position), vehicle: null};
            else {
                if (lane.joins.after == null) return {distance: Infinity, vehicle: null};
                else return this.findNextObstruction(lane.joins.after, Math.max(0,position-lane.distance), distance + lane.distance - position);
            }
        }
        return {distance:Math.max(0,distance+nextVehicle.currentSituation().position-position),vehicle:nextVehicle};
    };

    Simulation.prototype.findPreviousObstruction=function(lane,position,distance) {
        if (lane == null) return {distance: Infinity, vehicle: null};
        var lastVehicle = null;
        this.vehicles.forEach(function (vehicle) {
            if (vehicle.status<3 && vehicle.currentSituation().lane.id == lane.id && vehicle.currentSituation().position <= position) {
                if (lastVehicle == null || lastVehicle.currentSituation().position > vehicle.currentSituation().position) lastVehicle = vehicle;
            }
        });
        if (lastVehicle == null) {
            if (lane.joins.before == null) return {distance: Infinity, vehicle: null};
            else return this.findPreviousObstruction(lane.joins.before, Math.min(lane.joins.before, position - lane.distance), distance + lane.distance - position);
        }
        return {distance:distance+position-lastVehicle.currentSituation().position,vehicle:lastVehicle};
    };

    Simulation.prototype.addVehicle=function(lane) {
        var vehicle=new this.Vehicle(lane);
        this.vehicles.push(vehicle);
        return vehicle;
    };

    Simulation.prototype.step=function() {
        var me=this;

        function behindMe(i) {
            var distance=Infinity;
            if (i>0) {
                distance=me.vehicles[i].currentSituation().lane.distanceBehind(me.vehicles[i-1].currentSituation().lane,0);
                distance+=me.vehicles[i].currentSituation().position;
                distance-=me.vehicles[i-1].currentSituation().position;
            }
            return {distance:Infinity,vehicle:distance==Infinity ? null : me.vehicles[i-1] };
        }
        function infrontofMe(i) {
            var distance=me.vehicles[i].currentSituation().lane.distanceToend(0);
            if (i<me.vehicles.length-1) {
                distance=me.vehicles[i+1].currentSituation().lane.distanceBehind(me.vehicles[i].currentSituation().lane,0);
                distance+=me.vehicles[i+1].currentSituation().position;

            }
            distance-=me.vehicles[i].currentSituation().position;
            return {distance:distance,vehicle:distance==Infinity ? null : me.vehicles[i+1] };
        }

        for (var i=0;i<this.vehicles.length;i++) {
            this.vehicles[i].step(behindMe(i),infrontofMe(i));
        }
        this.vehicles=this.vehicles.filter(function(vehicle) {
            return vehicle.status<3;
        });
        this.vehicles.sort(function(v1,v2) {
            function behind(l1,l2) {
                if (l2==null || l1==null) return false;
                if (l1.id==l2.id) return true;
                return behind(l1,l2.joins.before);
            }

            if (v1.newSituation().lane==v2.newSituation().lane) {
                if (v1.newSituation().position<v2.newSituation().position) return -1;
                if (v1.newSituation().position>v2.newSituation().position) return 1;
            } else {
                if (behind(v1.newSituation().lane, v2.newSituation().lane)) return -1;
                if (behind(v2.newSituation().lane, v1.newSituation().lane)) return 1;
            }
            return 0;
        });

        this.iteration++;
        console.log("Iterated to "+this.iteration);
        return;
    };



    return Simulation;
})();




