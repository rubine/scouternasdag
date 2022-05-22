// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';

// export default function handler(req, res) {
//   // try {
//   //   const data = fs.readFileSync('../../JSONDATA/', 'utf8');
//   //   console.log(data);
//   // } catch (err) {
//   //   console.error(err);
//   // }
//   console.log(req.params)
//   res.status(200).json({ name: 'John Doe' })
// }
// import { NextApiRequest, NextApiResponse } from "next";

export default async (request, response) => {

  console.log(request.query.year);
  try {
    const data = fs.readFileSync('./pages/api/JSONDATA/Myr_avd_' + request.query.year + '.json', 'utf8');
    console.log(data);
    return response.status(200).json(JSON.parse(data));
  } catch (err) {
    return response.status(500).json({ ...err});
  }
  // do nothing fancy and simply return a string concatenation
};