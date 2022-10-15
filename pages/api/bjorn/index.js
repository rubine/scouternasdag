import fs from 'fs';

export default async (request, response) => {
  const types = ['avd', 'pat', 'kalkpat', 'kalkavdpat', 'kalkavdcontrol', 'kalkavdcontrolmyr']
  try {
    const type = types.find((type)=> type === request.query.type)
    const year = Number(request.query.year)
    if (type){
      const data = fs.readFileSync('./JSONDATA/Bjo_' + (type === 'kalkpat' ||  type === 'kalkavdcontrolmyr' ||type === 'kalkavdpat'  || type === 'kalkavdcontrol' ? 'pat' : type) + '_' + year + '.json', 'utf8');
      return response.status(200).json(JSON.parse(data));
    } else {
      return response.status(200).json(JSON.parse());
    }
  } catch (err) {
    return response.status(500).json({ ...err});
  }
};