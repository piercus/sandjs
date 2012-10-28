# Sand.js


JS Sandboxing made easy, Lightweight module manager for Javascript.

## Introduction

Sand.js is a part of the fjs project.
Sand.js is a module manager that would fullfill the following requirements :

*   lightweight, sandjs is not a librairy, it's a middleware. See [Why is Sandjs lightweight](/lightweight)
*   fast, fast to code, fast to execute. See [Why is Sand.js fast](/fast)
*   cross-plateform, module manager is the key to code portability. See [Why is Sand.js portable](/portable)

## sand.define
Let's make a new project called myProject, we define the modules

    //in myProject/first.js (by convention)
    sand.define("myProject/first", function(r) {
      
      console.log("Execute first");
      
      return {
        foo : "bar"
      };
    });
    
    //in myProject/second.js (by convention)
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
    
    // or require a folder
    sand.require("myProject/*", function(r) {
      console.log(r.myProject);
    });
    //=> Execute first
    //=> Execute second
    //=> { first : { "foo" : "bar"}, second : { first : { "foo" : "bar" }, foo2 : "bar2" } }
    

## Librairies

To add a librairie to sandjs, fork the librairy, and scope it into a sandjs format.
To add it to the list, send us an email at fjsproject[at]gmail.com..



