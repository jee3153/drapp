const { v4 } = require('uuid');
const { FileUpload } = require('graphql-upload');
const { bucket } = require('./config');

// bucket.getBuckets().then(console.log((x) => console.log(x)));
// function to check if the size of the file is permitted
const checkFileSize = (createReadStream, maxSize) =>
	new Promise((resolves, rejects) => {
		let filesize = 0;
		let stream = createReadStream();

		stream.on('data', (chunk) => {
			filesize += chunk.length;

			if (filesize > maxSize) {
				rejects(filesize);
			}
		});
		stream.on('end', () => resolves(filesize));
		stream.on('error', rejects);
	});

const generateUniqueFilename = (filename) => {
	// step 1 - scrub filenname to remove spaces
	const trimmedFilename = filename.replace(/\s+/g, `-`);

	// step 2 - ensure filename is unique by appending a UUID
	const unique = v4();

	// step 3 - return the unique filename
	return `${unique}-${trimmedFilename}`;
};

const uploadToGoogleCloud = (createReadStream, filename) => {
	console.log('uploadToGoogleCloud exec');
	// upload the file to Google Cloud Storage
	return new Promise(
		(res) =>
			createReadStream()
				.pipe(
					bucket.file(filename).createWriteStream({
						resumable: false,
						gzip: true
					})
				)
				// .on('error', (err) => rejects(err)) // reject on error
				.on('finish', res) //resolves on finish
	);
};

module.exports = { checkFileSize, generateUniqueFilename, uploadToGoogleCloud };
