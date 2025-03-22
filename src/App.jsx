import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout y Providers
import Dashboard from "./layout/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import { DisfracesProvider } from "./context/ProductosProvider";

// Pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/login";
import Register from "./pages/register";
import Confirm from "./pages/Confirmar";
import ForgotPassword from "./pages/Forgot";
import ResetPassword from "./pages/Restablecer";
import Profile from "./pages/perfil";
import NotFound from "./pages/NotFound";

// Routes
import AuthLayout from "./layout/Auth";
import PrivateRoute from "./routes/PrivateRoutes";

function App() {
    return (
        <AuthProvider>
            <DisfracesProvider>
                <Router>
                    <div className="app-container">
                        <div className="main-content">
                            <Routes>
                                {/* 📌 Dashboard Layout */}
                                <Route path="/" element={<Dashboard />}>
                                    <Route index element={<Home />} />
                                    <Route path="productos/:id" element={<ProductDetail />} /> {/* ✅ Corregido */}
                                    <Route 
                                        path="perfil" 
                                        element={
                                            <PrivateRoute allowedRoles={["admin", "user"]}>
                                                <Profile />
                                            </PrivateRoute>
                                        } 
                                    />
                                </Route>

                                {/* 📌 Authentication Routes */}
                                <Route path="/login" element={<AuthLayout />}>
                                    <Route index element={<Login />} />
                                </Route>
                                <Route path="/register" element={<AuthLayout />}>
                                    <Route index element={<Register />} />
                                </Route>
                                <Route path="/confirm/:token" element={<Confirm />} />
                                <Route path="/forgot/id" element={<ForgotPassword />} />
                                <Route path="/reset-password/:token" element={<ResetPassword />} />

                                {/* 📌 404 Page */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </div>
                </Router>
            </DisfracesProvider>
        </AuthProvider>
    );
}

export default App;
