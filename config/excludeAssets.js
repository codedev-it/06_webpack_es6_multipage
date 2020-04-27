'use strict';
var assert = require('assert');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function HtmlWebpackExcludeAssetsPlugin (options) {
  assert.equal(options, undefined, 'The HtmlWebpackExcludeAssetsPlugin does not accept any options');
  this.PluginName = 'HtmlWebpackExcludeAssetsPlugin';
}

HtmlWebpackExcludeAssetsPlugin.prototype.apply = function (compiler) {
  if ('hooks' in compiler) {
    // v4 approach:
    compiler.hooks.compilation.tap(this.PluginName, this.applyCompilation.bind(this));
  } else {
    // legacy approach:
    // Hook into the html-webpack-plugin processing
    compiler.plugin('compilation', this.applyCompilation.bind(this));
  }
};

HtmlWebpackExcludeAssetsPlugin.prototype.applyCompilation = function applyCompilation (compilation) {
  var self = this;
  HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(this.PluginName, registerCb);

  function registerCb (htmlPluginData, callback) {
    var excludeAssets = htmlPluginData.plugin.options.excludeAssets;
    // Skip if the plugin configuration didn't set `excludeAssets`
    if (!excludeAssets) {
      if (callback) {
        return callback(null, htmlPluginData);
      } else {
        return Promise.resolve(htmlPluginData);
      }
    }

    if (excludeAssets.constructor !== Array) {
      excludeAssets = [excludeAssets];
    }

    // Skip invalid RegExp patterns
    var excludePatterns = excludeAssets.filter(function (excludePattern) {
      return excludePattern.constructor === RegExp;
    });

    var result = self.processAssets(excludePatterns, htmlPluginData);
    if (callback) {
      callback(null, result);
    } else {
      return Promise.resolve(result);
    }
  }
};

HtmlWebpackExcludeAssetsPlugin.prototype.isExcluded = function (excludePatterns, assetPath) {
  return excludePatterns.filter(function (excludePattern) {
    return excludePattern.test(assetPath);
  }).length > 0;
};

HtmlWebpackExcludeAssetsPlugin.prototype.processAssets = function (excludePatterns, pluginData) {
  var self = this;
  var body = [];
  var head = [];
  pluginData.headTags.forEach(function (tag) {
    if (!tag.attributes || !self.isExcluded(excludePatterns, tag.attributes.src || tag.attributes.href)) {
      head.push(tag);
    }
  });

  pluginData.bodyTags.forEach(function (tag) {
    if (!tag.attributes || !self.isExcluded(excludePatterns, tag.attributes.src || tag.attributes.href)) {
      body.push(tag);
    }
  });

  return { headTags: head, bodyTags: body, plugin: pluginData.plugin, chunks: pluginData.chunks, outputName: pluginData.outputName };
};

module.exports = HtmlWebpackExcludeAssetsPlugin;
