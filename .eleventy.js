const htmlmin = require("html-minifier");
const { DateTime } = require('luxon');
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const vite = require("@11ty/eleventy-plugin-vite");
const webc = require('@11ty/eleventy-plugin-webc');
const imageShortcode = require('./src/_shortcodes/image');
const renderShortcode = require('./src/_shortcodes/render');
const renderHtmlFilter = require('./src/_filters/renderHtml');

module.exports = function(eleventyConfig) {

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  }
  
  // Plugins
  eleventyConfig.addPlugin(vite);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(webc, {
    components: "_includes/**/*.webc",
  });

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("render", async (content) => renderShortcode(content, eleventyConfig));

  // Filters
  eleventyConfig.addAsyncFilter("renderHtml", async (content) => await renderHtmlFilter(content, eleventyConfig));
  eleventyConfig.addFilter("readableDate", dateObj => {return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy")});

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  eleventyConfig.addPassthroughCopy({ "src/static/fonts": "fonts"});

  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  var pathPrefix = "";
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split('/')[1];
  }

  return {
    dir: {
      input: "src"
    },
    pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  }
};

function htmlminTransform(content, outputPath) {
  if( outputPath.endsWith(".html") ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
}
