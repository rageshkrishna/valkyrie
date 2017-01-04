test("Can register component", function() {
	var Foobar = function() {
		this.message = "This is foobar";
	};

	valkyrie._clear();

	valkyrie.register("foobar", function() {
		return new Foobar();
	});

	ok(true);
});

test("Can get component", function() {
	var Foobar = function() {
		this.message = "This is foobar";
	};

	valkyrie._clear();

	valkyrie.register("foobar", function() {
		return new Foobar();
	});

	var foobar = valkyrie.get("foobar");
	ok(foobar, "Get returns a valid object");
	ok(foobar.message == "This is foobar", "The message is preserved");
});

test("Can chain dependencies", function() {
	var Fizzbin = function(foobar) {
		this.message = foobar.message;
	};

	var Foobar = function() {
		this.message = "This is foobar";
	};

	valkyrie._clear();

	valkyrie.register("foobar", function() {
		return new Foobar();
	});

	valkyrie.register("fizzbin", ["foobar"], function(foobar) {
		return new Fizzbin(foobar);
	});

	var fizz = valkyrie.get("fizzbin");
	ok(fizz, "Get returns an object");
	ok(fizz.message == "This is foobar", "The message is preserved");
})

test("Can detect circular dependencies", function() {
	

	var Foobar = function() {
		this.message = "This is foobar";
	};

	valkyrie._clear();

	valkyrie.register("foobar", ["fizzbin"], function() {
		return new Foobar();
	});

	valkyrie.register("fizzbin", ["foobar"], function(foobar) {
		var Fizzbin = function(foobar) {
			this.message = foobar.message;
		};
		
		return new Fizzbin(foobar);
	});

	raises(function() { 
		valkyrie.get("fizzbin"); 
	}, function(e) { 
		if (e.error === "Circular dependency") {
			return true;
		}
		
	}, "Must throw circular dependency exception");
	
})
