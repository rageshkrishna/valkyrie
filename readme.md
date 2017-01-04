## Valkyrie 

The `src` folder contains the source code for Valkyrie, a project that manages dependencies for JavaScript modules.

### How to use Valkyrie
- Define your module

  Modules are defined using the <code>valkyrie.register</code> method. <code>register</code> takes two or three parameters, depending on how you want to use it. To define a module that has no dependencies on other modules, you would do this:
  ```javascript
  valkyrie.register("foobar", function() {
    return new Foobar();
  });
  ```

  This defines a new module called "foobar". The function passed in as the second parameter is called when you need an instance of "foobar" somewhere else in your code. In our example, this simply calls a constructor function and returns the resulting object. To define a module that depends on "foobar", you would do this:

  ```javascript
  valkyrie.register("fizzbin", ["foobar"], function(foobar) {
    return new Fizzbin(foobar);
  });
  ```
  
  When you request an instance of "fizzbin" in your code, Valkyrie will first figure out how to create an instance of "foobar" and pass it in to the function where you can then use it to construct "fizzbin".
		
- Resolving modules

  The second part of working with Valkyrie is all about using your registered modules to create bigger components.

  ````javascript
  valkyrie.resolve("foobar", "fizzbin", function(foobar, fizzbin) {
    // You can use foobar and fizzbin here to do stuff in your app.
  })
  ````

### Challenge description
Valkyrie does not handle circular dependencies well. It only implements a very basic hack to stop trying to resolve dependency chains that are longer than 50 levels deep. Opening `tests/index.html` will run a few tests in your browser and is already set up to fail the dependency chain check. Your challenge is to improve on the current hack that prevents circular dependencies from crashing your browser.