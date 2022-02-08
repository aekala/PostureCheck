const path = require("path");
const baseDir = path.join(__dirname, "..");
const srcDir = path.join(baseDir, "src");
const distDir = path.join(baseDir, "dist");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		popup: path.join(srcDir, "popup.tsx"),
		options: path.join(srcDir, "options.tsx"),
		background: path.join(srcDir, "background.ts"),
		content_script: path.join(srcDir, "content_script.tsx"),
		// button: path.join(srcDir, "button.tsx"),
	},
	output: {
		path: path.join(__dirname, "../dist/js"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
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
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.join(baseDir, "public"),
					to: path.join(distDir, "public"),
				},
				{
					from: path.join(baseDir, "styles"),
					to: path.join(distDir, "styles"),
				},
				{
					from: path.join(baseDir, "images"),
					to: path.join(distDir, "images"),
				},
				{
					from: path.join(baseDir, "manifest.json"),
					to: path.join(distDir),
				},
			],
		}),
	],
};
