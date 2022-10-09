import fs from 'fs';

export default async (_, response) => {
    try {
        return response.status(200).json(JSON.parse(fs.readFileSync('./JSONDATA/statistics.json', 'utf8')));
    } catch (err) {
        return response.status(500).json({ ...err });
    }
};