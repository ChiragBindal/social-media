const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path : './.env'});

// Connecting mongoose
const DB = process.env.DATABASE_URL.replace('<password>' , process.env.DATABASE_PASSWORD);

async function main(){
   await mongoose.connect(DB)
}
let a = main();
a.then(()=>{
    console.log('Database Connected Sucessfully !');
});

// Listening to PORT
const port = process.env.PORT || 8000;
app.listen(port , ()=>{
    console.log(`app is running on the ${port}`);
});
