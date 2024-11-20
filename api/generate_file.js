const { PoopFile } = require('../poop/poopFile');

module.exports = async (req, res) => {
    const poopFile = new PoopFile();
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    try {
        await poopFile.getAllFile(url);
        res.status(200).json(poopFile.file);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};
