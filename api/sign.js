// api/sign.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Relying on the baseline working body interpretation logic
    let payloadText = '';
    if (req.body) {
      if (typeof req.body === 'string') {
        try {
          const parsed = JSON.parse(req.body);
          payloadText = parsed.text;
        } catch (e) {
          payloadText = req.body;
        }
      } else if (typeof req.body === 'object') {
        payloadText = req.body.text;
      }
    }

    if (!payloadText) {
      return res.status(400).json({ error: 'Missing payload text string to sign' });
    }

    const rawBase64Key = 
      "MIIEogIBAAKCAQEAq8j2SHHfzMLlhYppnlk+QqjjjZwMkhK6s6rERd0JhhY/6+Md" +
      "4Z0327uEdfNbJrSEPJVPT55gjRhx4MorEhrabuafuY8thSPS4epwkOjjPtELwZxV" +
      "iWe1dzG5TQakJ/i8ZOQuUYFJg02RcwUTzE3ty+x7mkwj9t2wAdRqTagyaDIAVMTx" +
      "P/Y4AS76xjA3aH43Q0HKHGAxxIlXBIQxImuPhlUbPtVtTHIsUwkIx2BDh8kPZ3Mg" +
      "r3Cyky0F+cHpEFSi3rPSSLD/FVHlJRW2cODVm8E+s98CURQYs1npzDztzZgZPnnb" +
      "9K57CB2Z50Ve6qUV7z4+uHs3nehiMJHktIs7LQIDAQABAoIBAAufb7vBaf0ugfKx" +
      "8D56AaKR+b925korK+hZw/40G9+veV4KQlclrjCsSc854BoeJET9wd18X5em++wp" +
      "Juvf1uqiU6lC54y2up8gH8NLi+CP//shYDoz7aJlwgiqS94L0CIFZvWLHqsHIFxc" +
      "uhUHKsaINr60VcnvVZLHc/UoIwJLT1Hk2gIMnxxnCqkL1m/BNDeYaT30DLMPaeby" +
      "naEsq6JG+pk0szJ9ivTZQrVzWL88qYJor7eR+MGBh65fhhSZyn229EL9DtwVGkU2" +
      "8rlFwcCalhmCIgJO9vPK3QLoomT4FfokuECrxv0UwopYPBXyUycvzHmvbFTt5FS8" +
      "KLgfMcMCgYEAwqKKSeAuoQpJO4x8hP7fYQ94ezoRkDlV9Q5ICcgJW6giMbzT2adg" +
      "d2nuxQIwLRX/P4Dwh2OxCnOrX1FAMxmbs9/6OGgjHhKAAM0pIowZFs4Vqu/QlAZ5" +
      "UdPzHdGuA5oSEBhVMxe0L1dWbQr0UpjemH6gOfswDFYsIawLXOPI+TsCgYEA4fIm" +
      "QqIBoYAGUPuNfjoK2ZQpRaFGAGuvfpSyljMQDnYJJtOGTW8SI0QFzd31snYx5yP" +
      "vEvkR4lEcVPi6t6Mkdd4KVkmktdjIQ0ZOAlbBaaEWFy6lN7TyINJ7BAYFO/1D3Uj" +
      "4Gi9O7dV7v49Bzp5tVNFrUihM1yfOdUfP3gCFrcCgYB8YtoT6mSCYIt6tgaiDCx/" +
      "4B40SmENFcdcTBs3vRJV9DaeKLoPIEujJR0F5KcbOTKdx+5v6AMt1cxQpyFrRtNd" +
      "+ib0Q4El59bMLFE8leI208+/JXHcF+MSq2x0wxr9jEo85QAWHfD2TE+ccmLAIpgn" +
      "Rs1pIKGNUMj1X/kHDT/UHwKBgAsmSeEL6C56OlME2SJsr/hESkJ7RAIVQyw4yBEY" +
      "JKwerp3P1CDGWA40d9DNeeptd3cSML2X+SHWkjwNaasxZDpmKZXQwmiInGmrHc14" +
      "GLfEqc86dDKYdFb2s5UkjiuqU6t5mlWelYf22hS7EwPiTNM30r5kUSAZt/nAnJQj" +
      "NectAoGADXNyBnmq65m1YMlWe+PtDEi/hUZagVDPG7xh3T811fAi6+TZSLXCDVR4" +
      "gju9FJkwjce29Bmt7xbFYRvIfVUGbuvMxvgBJG4A2BG8wrFbIGDLQEk5VYBvSkKK" +
      "hniCoSnVEJYlfgyp9ri1vEgXrX18FwY1KADRc4EnDlEzwkkAAl0=";

    // Standard formatting wrapper
    const privatePemKey = `-----BEGIN RSA PRIVATE KEY-----\n${rawBase64Key}\n-----END RSA PRIVATE KEY-----`;

    // Passing explicit object parameters to crypto to match exact PKCS#1 padding requirements
    const privateKeyObject = crypto.createPrivateKey({
      key: privatePemKey,
      format: 'pem',
      type: 'pkcs1' 
    });

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(payloadText);
    signer.end();

    const signatureBase64 = signer.sign(privateKeyObject, 'base64');

    // Convert Base64 safely to regular URL format but PRESERVE alternative variables for fast debugging
    const base64UrlStandard = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_');
    const base64UrlUnpadded = base64UrlStandard.replace(/=/g, '');

    // Return the unpadded version as default, but we can instantly switch if needed
    return res.status(200).json({ mpiMac: base64UrlUnpadded });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
