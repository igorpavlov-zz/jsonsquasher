/*!
 * jsonsquasher - JSON Compressor
 * https://github.com/igorpavlov/jsonsquasher
 * MIT License | (c) Igor Pavlov 2017
 */

! function(root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else root[name] = definition()
}(this, 'jsonsquasher', function() {

  var compress = function(json,options) {
    options = options || {};
    if(!options.mutateJSON){
      json = JSON.parse(JSON.stringify(json));
    }
    var traverse = function(node) {
      if(isCompressible(node)){
        node.unshift([]);
        node.unshift(1);
        for(var i = 1; i < node.length; i++){
          var child = node[i];
          var objArr = [];
          for(var j in child){
            var val = child[j];
            var mapKeyIndex = node[1].indexOf(j);
            var l;
            if(mapKeyIndex!==-1){
              l = mapKeyIndex;
            } else {
              l = node[1].length;
              node[1].push(j);
            }
            if(val!==null){
              objArr[l] = val;
            }
            traverse(val);
          }
          node[i] = objArr;
        }
      } else if(typeof(node)==="object") {
        for(var k in node){
          var child = node[k];
          traverse(child);
        }
        if(isArray(node)){
          node.unshift(0);
        }
      }
    }
    traverse(json);
    return json;
  }

  var decompress = function(json,options) {
    options = options || {};
    if(!options.mutateJSON){
      json = JSON.parse(JSON.stringify(json));
    }
    var traverse = function(node) {
      if(isArray(node)){
        for(var i = 2; i < node.length; i++){
          var child = node[i];
          if(isCompressed(node)){
            var arrObj = {};
            for(var j in child){
              var val = child[j];
              if(val!==null){
                var k = node[1][j];
                arrObj[k] = val;
              }
            }
            node[i] = arrObj;
          }
          traverse(node[i]);
        }
        if(isCompressed(node)){
          node.shift();
        }
        node.shift();
      } else if(typeof(node)==="object") {
        for(var k in node){
          var child = node[k];
          traverse(child);
        }
      }
    }
    traverse(json);
    return json;
  }

  var isCompressible = function(x){
    if(!isArray(x)){
      return false;
    }
    var keys = {};
    for(var i = 0; i < x.length; i++){
      var child = x[i];
      if(!isObject(child)){
        return false;
        break;
      }
    }
    return true;
  }

  var isCompressed = function(x){
    return x[0] === 1;
  }

  var isObject = function(x){
    return typeof(x)==="object" && !isArray(x);
  }

  var isArray = function(x){
    return Array.isArray(x);
  }

  return {
    compress: function(json,options){ return compress(json,options)},
    decompress: function(json,options){ return decompress(json,options)}
  };

});
