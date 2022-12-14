const preventMDh1 = require("../_helpers/preventH1");
const unescapeNjk = require("../_helpers/unescapeNjk");

module.exports = async function (content, eleventyConfig) {
	// escape nunjucks code in content inside data handlers
	content = await eleventyConfig.javascriptFunctions.renderTemplate(content, "njk");
	content = preventMDh1(content);
	content = unescapeNjk(content);
	return content;
};