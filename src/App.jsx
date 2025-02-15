import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CreateForm from './CreateForm';
import Admin from './Admin';
import Wallpaper from './Wallpaper';

export default function App() {
  return (
    <>
      <Wallpaper />
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<CreateForm />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
