import { Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import CreateForm from './CreateForm';
import Login from './Login';
import Wallpaper from './Wallpaper';

export default function App() {
  return (
    <>
      <Wallpaper />
      <Routes>
        <Route path="/" element={<CreateForm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
