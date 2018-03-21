let gulp = require('gulp');
let browserify = require('browserify');
let fs = require('fs');

gulp.task('build', function () {

	if(!fs.existsSync('./build')){
		console.log("Making build folder...");
		fs.mkdirSync('./build');
		fs.mkdirSync('./build/scripts');
	} else {
		console.log("Clearing build folder...");
		let files = fs.readdirSync('./build');
		for(let k in files){
			if(fs.lstatSync('./build/' + files[k]).isDirectory() === true) continue;
			fs.unlinkSync('./build/' + files[k]);
		}

		files = fs.readdirSync('./build/scripts');
		for(let k in files){
			fs.unlinkSync('./build/scripts/' + files[k]);
		}

		console.log("Copying scripts to build...");
		files = fs.readdirSync('./src/scripts');
		for(let k in files){
			fs.createReadStream("./src/scripts/" + files[k]).pipe(fs.createWriteStream("./build/scripts/" + files[k]));
		}
	}

	console.log("Copying index.html to build...");
	fs.createReadStream("./src/index.html").pipe(fs.createWriteStream("./build/index.html"));

	console.log("Copying style.css to build...");
	fs.createReadStream("./src/style.css").pipe(fs.createWriteStream("./build/style.css"));

	//for(let k in fs.readdirSync('./src/scripts')){

	//}

	try
	{
		console.log("Building bundle with Browserify...");
		let result = fs.createWriteStream('./build/main.min.js');
		let b = browserify();
		b.add('./src/main.js');
		return b.bundle()
			.on('end', ()=>{
				console.log("Done!");
			})
			.pipe(result);
	}
	catch(err)
	{
		console.log(err.stack);
	}


});