import './App.css';
import Home from './pages/Home';
import Edit from './pages/Edit';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* edit will get the id as well */}
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
    </div>
  );
}

export default App;
