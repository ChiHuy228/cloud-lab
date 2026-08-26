// mern-demo/client/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

// Tự động xử lý URL kết nối cho môi trường Codespaces
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/students`;
  }
  if (window.location.hostname.endsWith('.app.github.dev')) {
    const backendHost = window.location.hostname.replace(
      /-\d+\.app\.github\.dev$/,
      '-5000.app.github.dev'
    );
    return `${window.location.protocol}//${backendHost}/api/students`;
  }
  return 'http://localhost:5000/api/students';
};
const API_URL = getApiUrl();

function App() {
  // === CÂU 48: SỬ DỤNG REACT STATE QUẢN LÝ DỮ LIỆU FORM ===
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // === CÂU 47: GỌI API GET ĐỂ LẤY DANH SÁCH SINH VIÊN ===
  const fetchStudents = async () => {
    try {
      setLoading(true); setErrorMessage('');
      const res = await fetch(API_URL); // Mặc định là GET
      if (!res.ok) throw new Error(`Lỗi tải danh sách (${res.status})`);
      const data = await res.json();
      if (Array.isArray(data)) setStudents(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // === CÂU 49: GỬI DỮ LIỆU TỪ REACT ĐẾN API POST ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const res = await fetch(API_URL, {
        method: 'POST', // Sử dụng HTTP Method POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error(`Lỗi thêm sinh viên (${res.status})`);
      
      setFormData({ studentId: '', name: '', email: '' });
      await fetchStudents(); // Refresh lại danh sách
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="main-title">Hệ Thống Quản Lý Sinh Viên</h1>
        <p className="sub-title">Trường Đại học Công nghệ Cloud-Lab</p>
      </header>

      <div className="content-layout">
        {/* === CÂU 48: FORM NHẬP MSSV, HỌ TÊN VÀ EMAIL === */}
        <div className="form-card">
          <div className="card-header">
            <span className="icon">👤</span><h2 className="form-title">Thêm Sinh Viên Mới</h2>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label className="label">Mã sinh viên (MSSV)</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required className="input" />
            </div>
            <div className="input-group">
              <label className="label">Họ và Tên</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
            </div>
            <div className="input-group">
              <label className="label">Email sinh viên</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input" />
            </div>
            <button type="submit" className="submit-btn">Thêm Vào Danh Sách</button>
          </form>
        </div>

        {/* === CÂU 47: GIAO DIỆN HIỂN THỊ DANH SÁCH TỪ BACKEND === */}
        <div className="list-card">
          <div className="list-card-header">
            <div className="list-title-wrapper">
              <span className="list-title-icon">📊</span><h2 className="list-title">Danh Sách Sinh Viên</h2>
            </div>
            <span className="total-badge">Tổng số: {students.length}</span>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr className="table-header-row">
                  <th className="th">MSSV</th><th className="th">HỌ TÊN</th><th className="th">EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {students.map((sv, index) => (
                  <tr key={sv._id || index} className={`table-row ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
                    <td className="td td-id">{sv.studentId}</td>
                    <td className="td td-name">{sv.name}</td>
                    <td className="td td-email">{sv.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;