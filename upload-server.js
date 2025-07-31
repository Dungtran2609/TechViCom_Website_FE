/* eslint-env node */
/* eslint-disable no-undef */
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const fs = require('fs');

const app = express();
app.use(cors());
app.use('/images/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Trả về đường dẫn ngắn
  res.json({ url: `uploads/${req.file.filename}` });
});

app.listen(5000, () => {
  console.log('Upload server running on http://localhost:5000');
}); 