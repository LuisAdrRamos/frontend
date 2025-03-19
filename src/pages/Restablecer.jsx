import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';

const Restablecer = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [tokenback, setTokenBack] = useState(false);
    const [form, setForm] = useState({
        password: "",
        confirmpassword: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value || "" // Previene valores undefined
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/nuevo-password/${token}`;
            const respuesta = await axios.post(url, form);
            setForm({ password: "", confirmpassword: "" }); // Resetea correctamente el estado
            toast.success(respuesta.data.msg);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/recuperar-password/${token}`;
                const respuesta = await axios.get(url);
                setTokenBack(true);
                toast.success(respuesta.data.msg);
            } catch (error) {
                toast.error(error.response.data.msg);
            }
        };
        verifyToken();
    }, [token]);

    return (
        <div className='login-body'>
            <Link className="brand" to="/">
                <div className="brand-content">
                    <img
                        src="public/Imagenes/logo.png"
                        alt="Logo Megadisfraz"
                        className="header-logo-img"
                    />
                    <span className="brand-text">Megadisfraz</span>
                </div>
            </Link>
            <div className="login-wrapper">
                <ToastContainer />
                <h1 className="text-center mb-4 text-3xl font-semibold uppercase text-gray-500">
                    Bienvenido Otra Vez
                </h1>
                <small className="text-center text-gray-400 my-4 block text-sm">
                    Por favor ingresa los detalles
                </small>
                {tokenback &&
                    <form className='w-full' onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label className="mb-2 block text-sm font-semibold">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-control"
                                name='password'
                                value={form.password} // Siempre tiene un valor
                                onChange={handleChange}
                            />
                            <label className="mb-2 block text-sm font-semibold">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Repeat your password"
                                className="form-control"
                                name='confirmpassword'
                                value={form.confirmpassword} // Siempre tiene un valor
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <button className="btn btn-primary">Enviar</button>
                        </div>
                    </form>
                }
            </div>
        </div>
    );
};

export default Restablecer;