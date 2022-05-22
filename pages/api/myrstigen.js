import fs from 'fs';

export default async (request, response) => {
  try {
    const data = fs.readFileSync('./pages/api/JSONDATA/Myr_avd_' + request.query.year + '.json', 'utf8');
    return response.status(200).json(JSON.parse(data));
  } catch (err) {
    return response.status(500).json({ ...err});
  }
};