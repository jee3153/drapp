const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

const storage = new Storage({
	keyFilename: path.join(__dirname.slice(0, 43), '/advance-branch-333513-0a9dfd5c385f.json'),
	projectId: process.env.GCP_PROJECT_ID
	// credentials: {
	// 	client_email: process.env.GCP_CLIENT_EMAIL,
	// 	private_key: process.env.GCP_PRIVATE_KEY ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n') : ''
	// }
});

const bucketName = process.env.GCP_BUCKET_ID;

// const createBucket = async () => {
// 	await storage.createBucket();
// 	console.log(`Bucket ${bucketName} created.`);
// };

const bucket = storage.bucket(process.env.GCP_BUCKET_ID || '');
console.log(bucket);
console.log(process.env.GCP_PROJECT_ID);
console.log(__dirname.slice(0, 43));

// const bucket = storage;
module.exports = { bucket };
