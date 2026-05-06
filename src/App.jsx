import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import OrderPage from './pages/order_page'
import BongPage from './pages/bong_page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/order" replace />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/bong" element={<BongPage />} />
      </Routes>
    </BrowserRouter>
  )
}
