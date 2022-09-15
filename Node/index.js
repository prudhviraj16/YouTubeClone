const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const userRoutes = require('./routes/users.js')
const videoRoutes = require('./routes/videos.js')
const commentRoutes = require('./routes/comments.js');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin : "http://localhost:4000/api/",
    credentials: true
}));
const PORT = process.env.PORT || 4000

const mongoURI = `mongodb+srv://Prudhvi876:Prudhvi876@cluster0.xa0edpx.mongodb.net/youtube?retryWrites=true&w=majority`
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log('Connected to db successfully');
}).catch(err => {
    console.log('Failed to connect', err);
})

app.get('/', (req, res) => {
    res.send('Welcome to our app');
})

if(process.env.NODE_ENV=='production'){
    app.use(express.static("client/build"))
}



app.use("/api/users",userRoutes)
app.use("/api/videos",videoRoutes)
app.use("/api/comments",commentRoutes)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})