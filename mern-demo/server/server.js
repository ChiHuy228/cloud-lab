const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
require('dotenv').config();

const Student = require('../models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// API Hello
app.get('/api/hello', (req, res) => {
    res.json({ message: "Xác nhận Backend đang hoạt động trên Linux Server!" });
});

// Câu 36: Lấy danh sách sinh viên (GET)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Câu 37: Thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 38: Cập nhật thông tin sinh viên (PUT)
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Câu 39: Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa sinh viên' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server Node.js đang chạy trên port ${PORT}`);
});