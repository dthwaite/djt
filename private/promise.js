/**
 * HomeGrown Promise class that allows control of asynchronous callbacks
 *
 * A number of these are available in the cloud for NodeJS, but they all look dodgy, so for a few hours work, having one that
 * does exactly what I want is the best option. It's also an instructive piece of JS...
 *
 * constructor():
 *      No arguments: the usual case; a simple promise object that provides a the means for a process to callback to interested parties when complete or failed
 *      One or more arguments:  A set of Promises, all of which must succeed before this promise succeeds (unless the controller forces a result)
 *                              Any argument may be an array of arguments to facilitate dynamic dependency builds (and each of them may also be an array ...)
 *
 * One point of detail, where an array consists of just one promise, then the argument passed to the success callback is not enclosed in an array
 *
 * succeed() and fail() are called by the controller (he who made the Promise in the 1st place) to indicate success or failure of a certain operation
 * success() and failure() are called by the user who is waiting for the completion of some operation, passing a function to call in each case
 *
 * Once the Promise is in success or failure state, it stays there and any further callback attachments (success(), failure()) will result
 * in an immediate callback as appropriate.
 */

// Instantiates an instance of a Promise object
var promise=function() {
    this.successCallbacks=[];		// callbacks for when we succeed
    this.failureCallbacks=[];		// callbacks for when we fail
    this.state=1;					// 1=in progress, 2=succeeded, 3=failed
    this.successes=0;				// The number of successed received if this promise is a collection of others
    this.result=[];					// the success object(s) returned as parameters to the success callback
    this.failed=null;				// Details of the failure
    this.index=0;					// the parental index of this promise if it is part of a set of promises to a parent
    this.argcount=arguments.length;	// Record the argument count to compare with the count of successes - once equal then this succeeds
    this.isarray=false;				// True if this promise was instantiated with an array of promises

    var me=this;
    // If we pass promises into the constructor, then this promise will automatically succeed/fail according to those supplied
    // The number of arguments in the success() callback will be the same, and equate to, the promises passed as arguments here
    // However, an argument can also be an array of promises, in which case the equivalent argument in the success() callback
    // will be an array of results in the same order as the submitted promises. This means one can dynamically build a set of promises
    // to wait on as well as pass them statically into this constructor. Cool.

    // A rather special workaround to passing parameters into a class constructor when we have an array
    function newPromise(nestedpromise) {
        // Surrogate promise function
        function F() {
            return me.constructor.apply(this,nestedpromise);
        }
        F.prototype=me.constructor.prototype;
        return new F(); // return our new promise
    }

    function nestedPromiseSuccess(param) {
        // If we have more than one argument returned, then we deliver these back as an array
        if (arguments.length>1) me.result[this.index]=arguments;
        else {
            if (this.isarray) me.result[this.index]=[param];
            else me.result[this.index]=param;
        }
        me.successes++;
        // succeed this promise if we have received a success on all the participating promises
        if (me.successes===me.argcount) me.succeed();
    }

    function nestedPromiseFail(param) {
        me.fail(param);
    }

    for (var arg in arguments) {
        if (true) {
            var nestedpromise=arguments[arg];
            if (nestedpromise instanceof Array) {
                // If we've an array then we consolidate the promises therein into one promise
                nestedpromise=newPromise(nestedpromise); // call this anonymous function immediately
                if (arguments[arg].length==0) nestedpromise.succeed([]);
                else nestedpromise.isarray=true;
            }
            nestedpromise.index=parseInt(arg);
            nestedpromise.then(nestedPromiseSuccess,nestedPromiseFail); // Fail this promise if ANY of the participating promises fails
        }
    }
};

promise.prototype.chain=function(object,func,params) {
    var chainedpromise=new promise();
    this.success(function() {
        func.apply(object,params).then(function() {
                chainedpromise.succeed();
            },
            function() {
                chainedpromise.fail();
            });
    });
    return chainedpromise;
};

// Converts this promise into a proxy for the the given one - i.e. we succeed/fail as per the given promise
promise.prototype.proxy=function(promise) {
    var me=this;

    if (me.state==1) {
        promise.then(function(param) {
            me.succeed(param);
        }, function(param) {
            me.fail(param);
        });
    }
};

// Success proto function - called by the owner of the promise to set it into success state
promise.prototype.succeed=function(param) {
    if (this.state===1) { // Only execute if the promise is in pending state
        if (typeof param!=='undefined') this.result=[param]; // record the param as an array
        // Call each success callback, passing the promise as the 'this' object. Each array element of the result is passed as a parameter
        for (var i=0;i<this.successCallbacks.length;i++) this.successCallbacks[i].apply(this,this.result);
        this.state=2; // Set the state as succeeded (end state that cannot change)
    }
};

//Fail proto function - called by the owner of the promise to set is into failed state
promise.prototype.fail=function(param) {
    if (this.state===1) { // Only execute if the promise is in pending state
        this.failed=param;
        // Call each fail callback, passing the promise as the 'this' object. The parameter is expected to be the details of what failed
        for (var i=0;i<this.failureCallbacks.length;i++) this.failureCallbacks[i].call(this,param);
        this.state=3; // Set the state as failed (end state that cannot change)
    }
};

//Combined short cut user call to register both a failure and a success function
promise.prototype.then=function(success,failure) {
    if (typeof success ==='function') this.success(success);
    if (typeof failure ==='function') this.failure(failure);
    return this;
};

// A client of the Promise registers his callback for success here
promise.prototype.success=function(callback) {
    // If the Promise is already succeeded then call back immediately, otherwise push the callback onto our stack
    if (this.state===2) callback.apply(this,this.result);
    else this.successCallbacks.push(callback);
    return this; // Allow chaining
};

// A client of the Promise registers his callback for failure here
promise.prototype.failure=function(callback) {
    // If the Promise is already failed then call back immediately, otherwise push the callback onto our stack
    if (this.state===3) callback.call(this,this.failed);
    else this.failureCallbacks.push(callback);
    return this; // Allow chaining
};

// NodeJS module, returning this promise "class"
module.exports=function() {
    return promise;
};