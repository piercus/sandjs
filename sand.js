if (typeof(window) !== 'undefined') var sand = window.sand = {};
else var sand = global.sand = module.exports = {};

(function(sand) {
  sand.env = typeof(window) === 'undefined' ? 'node' : 'browser';

  Array.prototype.last = String.prototype.last = function() {
    return this[this.length - 1];
  };

  Array.prototype.each = function(f) {
    for (var i = -1, n = this.length; ++i < n; ) f(this[i], i);
    return this;
  };

  var keys = function(o) {
    var r = [];
    for (var i in o) r.push(i);
    return r;
  };
  
  sand.grains = {};
  
  var Grain = function(name, requires, fn, options) {
    this._grains = {};
    this.exports = {};
    this.name = name;
    this.path = name.split('/');
    this.innerName = this.path.last();

    var g = this;
    this.requires = requires.map(function(r){
        return g.resolve(r, g.name);
    });

    this.fn = fn;
    if (options) for (var i in options) this[i] = options[i];
  };
  
  Grain.prototype = {
    require : function(name) {
      return sand.getGrain(name).use(this, this);
    },
    
    use : function(local, sandbox, options, alias) {
      if (!local) local = this;
      if (!sandbox) sandbox = local;

      if (!sandbox._grains[this.name]) {
        sandbox._grains[this.name] = this;

        for (var i = this.requires.length; i--; ) {
          var split = this.requires[i].split('->');
          sand.getGrain(split[0]).use(this, sandbox, options, split[1] || null);
        }
        
        if (this.fn) {
          this.exports = this.fn(this.exports) || this.exports;
        }
      }
      
      local.exports[alias || this.innerName] = this.exports;
      return this.exports;
    },

    resolve : function(mName, baseName){
      if(mName[0] === ".") {
        if(mName[1] === "/"){

          var path = baseName.split("/");
          return this.resolve(mName.substr(2), path.slice(0,path.length-1).join("/"));
        
        } else if(mName[1] === "." && file[2] === "/"){
          var path = baseName.split("/");
          return this.resolve(mName.substr(3), path.slice(0,path.length-2).join("/"));
        } 
      }
      return mName;
    }
  };
  
  sand.getGrain = function(name) {
    if (sand.grains[name]) {
      return sand.grains[name];
    }
    if (name.last() === '*') { // folder
      var lvl = name.split('/').length,
        subFolders = {},
        l = name.length - 2,
        searched = name.slice(0, l);
      if (sand.grains[name.slice(0, name.length - 2)]) return sand.grains[name.slice(0, name.length - 2)];
      for (var i in this.grains) {
        if (i.slice(0, l) === searched) {
          var join = i.split('/').slice(0, lvl).join('/');
          if (!this.grains[join]) subFolders[join + '/*'] = true;
          else subFolders[join] = true;
        }
      }
      return sand.define(name.slice(0, name.length - 2), keys(subFolders));
    }
    return sand.define(name);
  };

  sand.define = function(name, requires, fn, options) {
    if (typeof(requires) === 'function') {
      fn = requires;
      requires = [];
    }
    else if (typeof(requires) === 'undefined') requires = [];
    return this.grains[name] = new Grain(name, requires, fn, options);
  };
    
  var id = 0;
  
  sand.require = function() {
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 1) {
      var app = new Grain('require-' + ++id);
      return (sand.grains[args[0]].use(app, app, null));
    }
    
    //--- parsing the requires
    var requires,
      fn = args.last();
    if (typeof(fn) !== 'function') {
      requires = args;
      fn = null;
    }
    else {
      requires = args.slice(0, args.length - 1);
    }
    //---
    
    var app = new Grain('require-' + ++id);
    requires.each(function(require) {
      var split = require.split('->'); // little repetition here for performance reasons
      sand.getGrain(split[0]).use(app, app, null, split[1] || null);
    });
    if (fn) return (fn(app.exports));
  };
    
  sand.define('sand', function() {
    return sand;
  });
  
  sand.global = function(name, value) {
    if (sand.env === 'node') {
      return global[name] = value;
    }
    window[name] = value;
  };
  
})(sand);
