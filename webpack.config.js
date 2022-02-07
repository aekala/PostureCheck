const path = require("path");
const srcDir = path.join(__dirname, "src");

module.exports = {
	entry: {
		popup: path.join(srcDir, "popup.ts"),
		options: path.join(srcDir, "options.ts"),
		background: path.join(srcDir, "background.ts"),
	},
	output: {
		path: path.join(__dirname, "./dist/js"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
