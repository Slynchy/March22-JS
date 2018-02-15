let gulp = require('gulp');
let browserify = require('browserify');
let fs = require('fs');

gulp.task('build', function () {

	if(!fs.existsSync('./build')){
		fs.mkdirSync('./build');
		fs.mkdirSync('./build/scripts');
	} else {
		let files = fs.readdirSync('./build');
		for(let k in files){
			fs.unlinkSync('./build/' + files[k]);
		}
		files = fs.readdirSync('./build/scripts');
		for(let k in files){
			fs.unlinkSync('./build/' + files[k]);
		}
	}

	fs.createReadStream("./src/index.html").pipe(fs.createWriteStream("./build/index.html"));

	for(let k in fs.readdirSync('./src/scripts')){

	}

	let result = fs.createWriteStream('./build/main.min.js');
	let b = browserify();
	b.add('./src/main.js');
	b.bundle().pipe(result);

});