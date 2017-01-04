(function(wnd) {
    var Injector = function() {
        var self = this,
            // The component registry
            registry = {},
            // Helper function to test if an object is an array
            isArray = function (obj) {
                return Object.prototype.toString.call(obj) === "[object Array]";
            },
            // Holds instances of singleton components
            singletonInstances = {};

        // This is a helper method to allow unit tests to clear the registry
        this._clear = function() {
            registry = {};
        };

        //
        // Registers a component as a singleton. The component will be constructed
        // only once and all subsequent resolves will be given the same instance
        //
        this.registerSingleton = function (name, dependencies, factory) {
            return self.register(name, dependencies, factory, true);
        }

        //
        // Registers a new component. A new instance of the component will be
        // created every time it is resolved.
        //
        this.register = function(name, dependencies, factory, isSingleton) {
            if (typeof name !== "string") {

                throw { 
                    name: "Component name is required",
                    message: "You must provide a name when registering a component"
                };
            };

            // Reorder the parameters if there are no dependencies
            if (Object.prototype.toString.call(dependencies) !== "[object Array]") {
                if (dependencies) {
                    factory = dependencies;
                    dependencies = [];
                } else {
                    dependencies = [];
                }
            };

            registry[name] = {
                dependencies: dependencies,
                factory: factory,
                isSingleton: isSingleton
            };
        };

        //
        // Gets the requested component
        // This method is called recursively to satisfy any nested dependencies
        //
        this.get = function(name, stack) {
            var component = registry[name],
                dependencies = [],
                i = 0;

            if (component.isSingleton) {
                if (singletonInstances[component.name]) {
                    return singletonInstances[component.name];
                }
            }

            // Poor man's circular dependency checker
            if (!stack) {
                stack = [];
            }

            stack.push(name);

            
            if (stack.length > 50) {
                throw {
                    error: "Dependency stack too big!"
                };
            }
            
            
            if (component && component.factory) {
                for (i = 0; i < component.dependencies.length; i++) {
                    dependencies.push(self.get(component.dependencies[i]));
                }
                var instance = component.factory.apply(this, dependencies);
                if (component.isSingleton) {
                    singletonInstances[component.name] = instance;
                }
                return instance;
            } else {
                throw {
                    name: "Unregistered component: " + name,
                    message: "The component you requested has not been registered."
                };
            };
        };

        //
        // Resolves a component's dependencies and passes them to the callback
        //
        this.resolve = function (requires, callback) {
            var dependencies = [],
                i = 0;

            if (!isArray(requires)) {
                throw {
                    name: "Invalid argument: requires",
                    message: "The 'requires' argument must be an array"
                };
            }

            for (i = 0; i < requires.length; i++) {
                dependencies.push(self.get(requires[i]));
            }

            callback.apply(this, dependencies);

        };
    };

    wnd.valkyrie = new Injector();
})(window);