import bcrypt from 'bcryptjs';
import user from '../models/user.model.js';
import { accessToken } from '../libs/jwt.js';


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Por favor completa todos los campos',
            errors: [
                { field: 'email', message: 'El correo es requerido' },
                { field: 'password', message: 'La contraseña es requerida' }
            ]
        });
    }

    try {
        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(400).json({ msg: 'Correo o contraseña incorrectas.',
                errors: [
                    { field: 'email', message: 'Revisa el correo proporcionado' },
                    { field: 'password', message: 'Revisa la contraseña proporcionado' }
                ]
            });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Correo o contraseña incorrectas.',
                errors: [
                    { field: 'email', message: 'Revisa el correo proporcionado' },
                    { field: 'password', message: 'Revisa la contraseña proporcionado' }
                ]
            });
        }

        const token = await accessToken({ id: userFound._id });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
            domain: process.env.COOKIE_DOMAIN,
            path: '/'
        });
        res.status(200).json({
            name: userFound.name,
            lastname1: userFound.lastname1,
            lastname2: userFound.lastname2,
            email: userFound.email,
            type: userFound.type
         });
    } catch (e) {
        return res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.', });
    }
};

export const register = async (req, res) => {
    const { name, lastname1, lastname2, email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Error al registrar el usuario', errors: [{ field: 'email', message: 'El correo electrónico ya está registrado' }] });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = new user({ name, lastname1, lastname2, email, password: hash, type: 'PROVEEDOR' });
        await newUser.save();
        res.status(201).json({ msg: 'Se ha registrado la cuenta con éxito.' });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({ msg: 'Error al registrar el usuario', errors: [{ field: 'email', message: 'El correo electrónico ya está registrado' }] });
        }
        res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.' });
    }
};

export const verifyToken = (req, res) => {
    res.json({ isValid: true, user: req.user });
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
};