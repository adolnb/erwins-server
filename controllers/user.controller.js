import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.model.js';

    
export const getUsers = async (req, res) => {
    try {
        const users = await user.find({ _id: { $ne: req.user.id } }).select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.' });
    }
};

export const getUser = async (req, res) => {
    try {
        const { token } = req.cookies;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await user.findById(decoded.id);
        if (adminUser.type !== 'ADMINISTRADOR') {
            return res.status(403).json({ msg: 'No tienes los permisos suficientes para realizar esta acción.' });
        }

        const { id } = req.params;
        const userFound = await user.findById(id).select('-password');
        
        if (!userFound) {
          return res.status(404).json({ msg: 'Este usuario no ha sido encontrado.' });
        }
        
        res.json(userFound);
    } catch (error) {

        res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.' });
    }
}

export const createUser = async (req, res) => {
    const { name, lastname1, lastname2, email, password, type } = req.body;
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await user.findById(decoded.id);
    if (adminUser.type !== 'ADMINISTRADOR') {
        return res.status(403).json({ msg: 'No tienes los permisos suficientes para realizar esta acción.' });
    }

    const requiredFields = { name, lastname1, lastname2, email, password, type };
    const missingFields = Object.entries(requiredFields).filter(([_, value]) => !value).map(([field]) => ({
        field,
        message: 'Este campo es obligatorio'
    }));

    if (missingFields.length > 0) return res.status(400).json({ msg: 'Todos los campos son obligatorios', errors: missingFields});

    try {
        const userFound = await user.findOne({ email });
        if (userFound) return res.status(400).json({ msg: 'El correo dado ya está registrado', errors: [{ field: 'email', message: 'Correo electrónico ya en uso' }] });

        const hash = await bcrypt.hash(password, 10);
        const newUser = new user({ name, lastname1, lastname2, email, password: hash, type });
        await newUser.save();
        res.status(201).json({ msg: 'Se ha registrado la cuenta con exitó.' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, lastname1, lastname2, email, type } = req.body;
    
    try {
        const { token } = req.cookies;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await user.findById(decoded.id);
        if (adminUser.type !== 'ADMINISTRADOR') {
            return res.status(403).json({ msg: 'No tienes los permisos suficientes para realizar esta acción.' });
        }
      
        const requiredFields = { name, lastname1, email, type };
        const missingFields = Object.entries(requiredFields).filter(([_, value]) => !value).map(([field]) => ({
            field,
            message: 'Este campo es obligatorio'
        }));
      
        if (missingFields.length > 0) return res.status(400).json({ msg: 'Todos los campos son obligatorios.', errors: missingFields});
        
        const emailExists = await user.findOne({ email, _id: { $ne: id } });
        if (emailExists) return res.status(400).json({ msg: 'Error al actualizar.', errors: [{ field: 'email', message: 'Correo electrónico ya en uso' }] });

        const updatedUser = await user.findByIdAndUpdate( id, { name, lastname1, lastname2, email, type }, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ msg: 'Este usuario no ha sido encontrado.' });
      
        res.json({ msg: 'Usuario actualizado correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { token } = req.cookies;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await user.findById(decoded.id);
        if (adminUser.type !== 'ADMINISTRADOR') {
            return res.status(403).json({ msg: 'No tienes los permisos suficientes para realizar esta acción.' });
        }

        const deletedUser = await user.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ msg: 'Ocurrio un error al encontrar este usuario.' });
        }

        res.json({ msg: 'Usuario eliminado correctamente.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor. Por favor comunicate con el administrador.' });
    }
};