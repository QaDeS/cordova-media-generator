  'use strict';

  var phantom = require('phantom'),
    q = require('q'),
    mkdirp = require('mkdirp'),
    async = require('async'),
    pkg = require('./package.json'),
    config = require(process.cwd() + "/mediagen-config");

  var ph;
  var mediaPath = config.mediaPath || 'Media';

  function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
  }

  var output = {
    generate: function(url, width, height, devicePixelRatio, savePath, saveFilename, delay) {
      var deferred = q.defer();

      if (!url || !width || !height || !savePath || !saveFilename) {
        deferred.reject({
          error: "A required argument is missing"
        });
        return deferred.promise;
      }
      if (!ph) {
        phantom.create().then(function(newPh) {
          ph = newPh;
          doGen();
        })
      } else {
        doGen();
      }

      function doGen() {
        ph.createPage().then(function(page) {
          page.property("viewportSize", {width: width, height: height}).then(function() {
            page.property("clipRect", {width: width, height: height}).then(function() {
              page.open(url).then(function() {
                  if (devicePixelRatio && devicePixelRatio !== 1) {
                  evaluate(page, function(devicePixelRatio) {
                    document.body.style.webkitTransform = "scale(" + devicePixelRatio + ")";
                    document.body.style.webkitTransformOrigin = "0% 0%";
                    document.body.style.width = (100 / devicePixelRatio) + "%";
                  }, devicePixelRatio);
                }
                mkdirp(__dirname + savePath, function(err) {
                  if (err) deferred.reject(err);
                  setTimeout(function(){
                    page.render(savePath + "/" + saveFilename, {
                      format: 'jpg',
                      quality: '60'
                    }).then(function(success) {
                      err = false;
                      console.log(arguments);
                      console.log("Generated screenshot", url, savePath, saveFilename);
                      if (err) {
                        deferred.reject(err);
                      } else {
                        deferred.resolve({
                          success: true
                        });
                      }
                      page.close();
                    });
                  }, delay);
                });
              });
            });
          });
        });
      }

      return deferred.promise;
    },
    generateAll: function() {
      var deferred = q.defer();
      async.eachLimit(output.screenshots, 1, function(item, cb1) {
        async.eachLimit(output.pages, 1, function(page, cb2) {
          output.generate(page.url, item.width, item.height, item.devicePixelRatio, item.savePath, item.filename + page.name + ".jpg", page.delay || 0)
            .then(function(result) {
              cb2();
            })
            .catch(cb2)
        }, function(err) {
          cb1(err);
        })
      }, function(err) {
        if (ph) ph.exit();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    },
    pages: [],
    screenshots: [{
      filename: "android-10in-1280x720-land",
      width: 1280,
      height: 720,
      savePath: mediaPath + '/android/screenshots/10in'
    }, {
      filename: "android-10in-2048x1152-land",
      width: 2048,
      height: 1152,
      savePath: mediaPath + '/android/screenshots/10in'
    }, {
      filename: "android-7in-1280x800-land",
      width: 1280,
      height: 800,
      savePath: mediaPath + '/android/screenshots/7in'
    }, {
      filename: "android-10in-1280x720-port",
      width: 720,
      height: 1280,
      savePath: mediaPath + '/android/screenshots/10in'
    }, {
      filename: "android-10in-2048x1152-port",
      width: 1152,
      height: 2048,
      savePath: mediaPath + '/android/screenshots/10in'
    }, {
      filename: "android-7in-1280x800-port",
      width: 800,
      height: 1280,
      savePath: mediaPath + '/android/screenshots/7in'
    }, {
      filename: "android-4in-1280x720-land",
      width: 1280,
      height: 720,
      savePath: mediaPath + '/android/screenshots/4in'
    }, {
      filename: "android-4in-1280x720-port",
      width: 720,
      height: 1280,
      savePath: mediaPath + '/android/screenshots/4in'
    }, {
      filename: "android-4in-800x480-land",
      width: 800,
      height: 480,
      savePath: mediaPath + '/android/screenshots/getjar'
    }, {
      filename: "android-4in-800x480-port",
      width: 480,
      height: 800,
      savePath: mediaPath + '/android/screenshots/getjar'
    }, {
      filename: "ipad-1024x768-land",
      width: 1024,
      height: 768,
      savePath: mediaPath + '/ios/screenshots/ipad'
    }, {
      filename: "ipadretina-2048x1536-land",
      width: 2048,
      height: 1536,
      devicePixelRatio: 2,
      savePath: mediaPath + '/ios/screenshots/ipadRetina'
    }, {
      filename: "iphone4-960x640-land",
      width: 960,
      height: 640,
      savePath: mediaPath + '/ios/screenshots/iphone4'
    }, {
      filename: "iphone5-1136x640-land",
      width: 1136,
      height: 640,
      savePath: mediaPath + '/ios/screenshots/iphone5'
    }, {
      filename: "ipad-1024x768-port",
      width: 768,
      height: 1024,
      savePath: mediaPath + '/ios/screenshots/ipad'
    }, {
      filename: "ipadretina-2048x1536-port",
      width: 1536,
      height: 2048,
      devicePixelRatio: 2,
      savePath: mediaPath + '/ios/screenshots/ipadRetina'
    }, {
      filename: "iphone4-640x960-port",
      width: 640,
      height: 960,
      savePath: mediaPath + '/ios/screenshots/iphone4'
    }, {
      filename: "iphone5-640x1136-port",
      width: 640,
      height: 1136,
      savePath: mediaPath + '/ios/screenshots/iphone5'
    }, {
      filename: "iphone6p-1242x2208-port",
      width: 1242,
      height: 2208,
      savePath: mediaPath + '/ios/screenshots/iphone6p'
    }, {
      filename: "iphone6p-2208x1242-land",
      width: 2208,
      height: 1242,
      savePath: mediaPath + '/ios/screenshots/iphone6p'
    }, {
      filename: "iphone6-1334x750-land",
      width: 1334,
      height: 750,
      savePath: mediaPath + '/ios/screenshots/iphone6'
    }, {
      filename: "iphone6-750x1334-port",
      width: 750,
      height: 1334,
      savePath: mediaPath + '/ios/screenshots/iphone6'
    }]
  };
  module.exports = output;
