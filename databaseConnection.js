const mongoose = require('mongoose');

async function DbConnection(){
const dbUrl = process.env.MONGO_URI;

if (!dbUrl) {
    throw new Error('MONGO_URI is not configured');
}

await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 5000
});
console.log('MongoDB connected');

// 🔥 ADD THESE LINES RIGHT HERE TO DESTROY THE BROKEN INDEX
try {
    await mongoose.connection.db.collection('users').dropIndex('id_1');
    console.log("💥 Success! The broken 'id_1' rule has been destroyed!");
} catch (err) {
    console.log("Index already gone or collection is clean.");
}
}

module.exports = DbConnection;