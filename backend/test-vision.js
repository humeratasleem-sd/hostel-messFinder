const http = require('http');
const fs = require('fs');
const path = require('path');

const boundary = '----FormBoundary' + Date.now();
const imgPath = path.join(__dirname, 'controllers', 'image.jpg');
const imgData = fs.readFileSync(imgPath);

const body = Buffer.concat([
  Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="image"; filename="image.jpg"\r\nContent-Type: image/jpeg\r\n\r\n'),
  imgData,
  Buffer.from('\r\n--' + boundary + '--\r\n')
]);

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/vision/detect-human',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': body.length
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.write(body);
req.end();
