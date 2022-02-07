const path = require("path");
const srcDir = path.join(__dirname, "..", "src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		popup: path.join(srcDir, "popup.ts"),
		options: path.join(srcDir, "options.ts"),
		background: path.join(srcDir, "background.ts"),
	},
	output: {
		path: path.join(__dirname, "../dist/js"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: path.resolve(__dirname, "../src/"),
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				include: path.resolve(__dirname, "../styles"),
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				include: path.resolve(__dirname, "../images"),
				type: "asset/resource",
			},
		],
	},
};
