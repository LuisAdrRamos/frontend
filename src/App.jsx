import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./layout/Dashboard";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route index element={<Home />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
