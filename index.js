const express = require('express');
const ytdl = require('ytdl-core');
const archiver = require('archiver');
const fs = require('fs');

const app = express();

app.get('/download', async (req, res) => {
    const youtubeLink = req.query.link;
    
    if (!youtubeLink) {
        return res.status(400).send('Please provide a valid YouTube link');
    }

    try {
        const videoInfo = await ytdl.getInfo(youtubeLink);
        const videoStream = ytdl(youtubeLink, { quality: 'highestaudio' });

        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename="${videoInfo.title}.zip"`);

        const archive = archiver('zip');
        archive.pipe(res);

        archive.append(videoStream, { name: `${videoInfo.title}.mp4` });
        archive.finalize();
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
