# Sand.js


JS Sandboxing made easy, lightweight module manager for JavaScript.

## Introduction

Sand.js is a part of the fjs project.
Sand.js is a module manager that would fullfill the following requirements :

*   lightweight, sandjs is not a librairy, it's a middleware. See [Why is Sandjs lightweight](/lightweight)
*   fast, fast to code, fast to execute. See [Why is Sand.js fast](/fast)
*   cross-plateform, module manager is the key to code portability. See [Why is Sand.js portable](/portable)

## sand.define
In myProject/first.js (by convention)

    sand.define("myProject/first", function(r) {
      
      console.log("Execute first");
      
      return {
        foo : "bar"
      };
    });
    
In myProject/second.js (by convention)

    sand.define("myProject/second", ["myProject/first"], function(r) {
      
      console.log("Execute second");
      
      return function(){
      
        console.log("Hello World");
        
        return {
          first : r.first,
          foo2 : "bar2"
        };
      };
    });

## sand.require
### Basic
    
    //in main.js
    
    // we require it by name
    sand.require("myProject/first");
    //=> Execute first
    
    // we require first by name and we use it in a callback function
    sand.require("myProject/first", function(r) {
      console.log(r.first);
    });
    //=> Execute first
    //=> { foo : "bar" };

### Recursively

    // folder/* require all the files in a folder
    sand.require("myProject/*", function(r) {
      console.log(r.myProject);
      console.log(r.myProject.second());
    });
    //=> Execute first
    //=> Execute second
    //=> { first : { "foo" : "bar"}, second : [Function] }
    //=> { first : { "foo" : "bar"}, foo2 : "bar2" }
    

### With alias

    // we require first by name and we use it in a callback function
    sand.require("myProject/first->aliasName", function(r) {
      console.log(r.aliasName);
    });
    //=> Execute first
    //=> { foo : "bar" };

## Contribute

Add an issue if you find bugs or please

*   Fork me
*   Add your tests
*   Make your contribution
*   Pass all the tests 
*   Add a pull request

## Librairies

To add a librairie to sandjs, fork the librairy, and scope it into a sandjs format.
To add it to the list, send us an email at fjsproject[at]gmail.com..



