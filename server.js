if(process.env.NODE_ENV !== 'production')
{
	require('dotenv').config();
}

const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const port = 3000 || process.env.PORT;
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', err =>{console.error(err)});
db.once('open', ()=>{console.log('Connected to Mongoose')});

app.post('/', urlencodedParser,(req, res)=>{
	if(!checkForm(req.body)){res.end('error')}
	if(!ytdl.validateURL(req.body.murl)){res.end('invalide video url')}
	ytdl.getBasicInfo(req.body.murl, function(err, info){
		let extension = req.body.type == 'mp3' ? 'mp3' : 'mp4';
		let container = extension + 'Dir';
		let vname = info.title.replace(/\W+/g, '')+'.'+extension;
		let vpath = path.join(__dirname, container, vname);
		//querydb
		//else
		switch(extension)
		{
		case 'mp3':
			ytdl(req.body.murl, {quality: 'highest', filter: 'audioonly'})
			.pipe(fs.createWriteStream(vpath))
			.on('close', function(){console.log('Downloaded');res.download(vpath)});
			break;
		case 'mp4':
			ytdl(req.body.murl, {quality: 'highest'})
			.pipe(fs.createWriteStream(vpath))
			.on('close', function(){res.download(vpath)});
			break;
		}
		//insertintodb
	})
})

app.listen(port, () => {
	console.log(`Server Listening on port ${port}`);
})

function checkForm(body){
	if(body.murl != 'undefined' && body.msubmit != 'undefined' && body.type != 'undefined')
	{
		return true;
	}else
	{
		return false;
	}
}