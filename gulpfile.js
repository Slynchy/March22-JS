let gulp = require('gulp');
let browserify = require('browserify');
let babel = require('babelify');
let fs = require('fs');
let rimraf = require('rimraf');
let copyDir = require('copy-dir');
let LineTypes = require('./src/engine/LineTypes.js');

function ClearBuildFolder(){
	console.log("Clearing build folder...");
	rimraf.sync('./build/*');
}

function CreateBuildFolder(makeBuild){
	console.log("Making build folder...");
	if(makeBuild)
		fs.mkdirSync('./build');
	fs.mkdirSync('./build/scripts');
	fs.mkdirSync('./build/assets');
	fs.mkdirSync('./build/assets/audio');
	fs.mkdirSync('./build/assets/backgrounds');
	fs.mkdirSync('./build/assets/characters');
    fs.mkdirSync('./build/assets/textbox');
	fs.mkdirSync('./build/assets/video');
}

function build(isProduction){
	if(isProduction) console.log("Building for production!");

	if(!fs.existsSync('./build')){
		CreateBuildFolder(true);
	} else {
		ClearBuildFolder();
		CreateBuildFolder(false);
	}

	console.log("Copying index.html to build...");
	fs.createReadStream("./src/index.html").pipe(fs.createWriteStream("./build/index.html"));

	console.log("Copying style.css to build...");
	fs.createReadStream("./src/style.css").pipe(fs.createWriteStream("./build/style.css"));

	console.log("Copying scripts to build...");
	let scripts = fs.readdirSync('./src/scripts');
	for(let k in scripts){
		fs.createReadStream("./src/scripts/" + scripts[k]).pipe(fs.createWriteStream("./build/scripts/" + scripts[k]));
	}

	console.log("Copying assets to build...");
	copyDir.sync('./src/assets', './build/assets');

	try
	{
		if(isProduction) console.log("Building bundle with Browserify + Babel + Uglifyify...");
		else console.log("Building bundle with Browserify + Babel...");

		let result = fs.createWriteStream('./build/main.min.js');
		let b;
		if(isProduction){
			b = browserify().transform(babel, { global: true  }).transform('uglifyify', { global: true  });
		} else {
			b = browserify().transform(babel, { global: true  });
		}

		// Entrypoint
		b.add('./src/main.js');

		for(let k in LineTypes){
			if(
				LineTypes[k] !== LineTypes.COMMENT &&
				LineTypes[k] !== LineTypes.NUM_OF_LINETYPES &&
				LineTypes[k] !== LineTypes.NULL_OPERATOR &&
				LineTypes[k] !== LineTypes.CHECKPOINT &&
				LineTypes[k] !== LineTypes.NARRATIVE &&
				LineTypes[k] !== LineTypes.DIALOGUE &&
				LineTypes[k] !== LineTypes.NUM_OF_LINETYPES
			){
				b.require('./src/engine/functions/' + LineTypes[k], {expose: '__' + LineTypes[k]});
			}
		}

		return b.bundle()
			.on('end', ()=>{
				console.log("Done!");
			})
			.pipe(result);
	}
	catch(err)
	{
		console.error(err);
		console.error(err.stack);
	}
}

gulp.task('build', ()=>{
	return build(false);
});
gulp.task('build_prod', ()=>{
	return build(true);
});