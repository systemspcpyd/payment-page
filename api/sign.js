// pages/api/sign.js or app/api/sign/route.js
import { KJUR, hextob64 } from 'jsrsasign';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { text } = req.body;
  const cleanKey = "YOUR_CLEAN_PRIVATE_KEY_HERE";
  
  let sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
  sig.init(cleanKey);
  sig.updateString(text);
  let sigValueHex = sig.sign();
  
  let base64Url = hextob64(sigValueHex).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return res.status(200).json({ mpiMac: base64Url });
}
