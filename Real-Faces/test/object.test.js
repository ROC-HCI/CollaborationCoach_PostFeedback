if (typeof NS == 'undefined') { NS = {}; }
 
NS.myFunction = {
    //empty stuff array, filled during initialization
    stuff: [],
 
    init: function init() {
        this.stuff.push('Testing');
    },
    reset: function reset() {
        this.stuff = [];
    },
    
    //replace “//will add new functionality here later” with the following:
    append: function append(string1, string2) {
        return string1 + ' ' + string2;
    }
};

NS.myFunction.init();


describe("myFunction", function() {
    var myfunc = NS.myFunction;
 
    beforeEach(function(){
        spyOn(myfunc, 'init').and.callThrough();
    });
 
    afterEach(function() {
        myfunc.reset();
    });
 
    it("should be able to initialize", function() {
        expect(myfunc.init).toBeDefined();
        myfunc.init();
        expect(myfunc.init).toHaveBeenCalled();
    });
 
    it("should populate stuff during initialization", function(){
        myfunc.init();
        expect(myfunc.stuff.length).toEqual(1);
        expect(myfunc.stuff[0]).toEqual('Testing');
    });
    
    //replace “//will insert additional tests here later” with the following:
    describe("appending strings", function() {
        it("should be able to append 2 strings", function() {
            expect(myfunc.append).toBeDefined();
        });
        it("should append 2 strings", function() {
            expect(myfunc.append('hello','world')).toEqual('hello world');
        });
    });

});