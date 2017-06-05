module.exports = function(options) {

  options = options || {};

  var colors = require('colors/safe');
  var jsonsquasher = require('../src/jsonsquasher');
  var jsoncomp = require('jsoncomp');
  var dir = __dirname + '/sample-json-files';

  var dirOriginal = __dirname + '/sample-json-files-original';
  var dirCompressed = __dirname + '/sample-json-files-compressed';
  var dirDecompressed = __dirname + '/sample-json-files-decompressed';

  if (!fs.existsSync(dirOriginal)){fs.mkdirSync(dirOriginal);}
  if (!fs.existsSync(dirCompressed)){fs.mkdirSync(dirCompressed);}
  if (!fs.existsSync(dirDecompressed)){fs.mkdirSync(dirDecompressed);}

  if(options.mutateJSON){
    console.log(colors.yellow("Warning: JSON mutation is enabled"));
  }

  var files = fs.readdirSync(dir);

  files.forEach(function (file) {
    if(!file.match(/^!/)){
      var jsonOriginal = require(dir+'/'+file);
      fs.writeFileSync(dirOriginal+'/'+file,JSON.stringify(jsonOriginal, null, 2));
      console.log(colors.magenta("======="));
      console.log("Testing " + file + " compression...");
      var jsonOriginalSize = JSON.stringify(jsonOriginal).length;
      console.log("Original size: " + jsonOriginalSize);
      console.log("### jsonsquasher");
      console.log("--- Compressing...");
      var startAlgorithmTime = new Date();
      var jsonCompressed = jsonsquasher.compress(jsonOriginal,options);
      var endAlgorithmTime = new Date();
      var jsonCompressedSize = JSON.stringify(jsonCompressed).length;
      console.log("Compression time: " + (endAlgorithmTime - startAlgorithmTime) + "ms");
      console.log("Compression final size: " + jsonCompressedSize);
      var compressionRate = 100-Math.round(jsonCompressedSize/jsonOriginalSize*100);
      if(compressionRate>0){
        console.log("Compression: " + compressionRate + "%");
      } else {
        console.log(colors.yellow("Warning: Compression: " + compressionRate + "%"));
      }
      fs.writeFileSync(dirCompressed+'/'+file,JSON.stringify(jsonCompressed, undefined, 2));
      console.log("--- Decompressing...");
      var startAlgorithmTime = new Date();
      var jsonDecompressed = jsonsquasher.decompress(jsonCompressed,options);
      var endAlgorithmTime = new Date();
      var jsonDecompressedSize = JSON.stringify(jsonDecompressed).length;
      console.log("Decompression time: " + (endAlgorithmTime - startAlgorithmTime) + "ms");
      fs.writeFileSync(dirDecompressed+'/'+file,JSON.stringify(jsonDecompressed, undefined, 2));
      if(jsonOriginalSize!==jsonDecompressedSize){
        throw("Test failed.");
      }
    }
  });
  console.log(colors.green("Success. All tests passed!"));

  return "End of test.";

}
