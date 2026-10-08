
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// CAU 58: CAU HINH CORS CHO PRODUCTION
// ==========================================

// Danh sach domain Frontend duoc phep
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

// Middleware CORS
app.use(cors({
  origin: function (origin, callback) {

    // Cho phep request khong co Origin
    if (!origin) {
      return callback(null, true);
    }

    // Kiem tra domain Frontend hop le
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Tu choi domain khong hop le
    return callback(new Error('Not allowed by CORS'));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log(
      `[${new Date().toISOString()}] ` +
      `${req.method} ${req.originalUrl} ` +
      `- Status: ${res.statusCode} ` +
      `- Time: ${duration}ms`
    );
  });

  next();
});

/* API trang chu Backend */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'He thong MERN Backend dang hoat dong',
    status: 'OK',
    version: '1.1'
  });
});


// ==========================================
// KET NOI MONGODB ATLAS
// ==========================================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Ket noi MongoDB Atlas thanh cong!');
  })
  .catch((err) => {
    console.error('Loi ket noi MongoDB:', err);
  });

// ==========================================
// API HELLO
// ==========================================

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Backend dang hoat dong thanh cong!'
  });
});

// ==========================================
// GET: LAY DANH SACH SINH VIEN
// ==========================================

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ==========================================
// POST: THEM SINH VIEN
// ==========================================

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ==========================================
// PUT: CAP NHAT SINH VIEN
// ==========================================

app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ==========================================
// DELETE: XOA SINH VIEN
// ==========================================

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Da xoa sinh vien'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ==========================================
// KHOI DONG BACKEND
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Node.js dang chay tren port ${PORT}`);
});
