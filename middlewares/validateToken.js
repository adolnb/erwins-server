import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) return res.status(401).json({ msg: 'No tienes acceso a esta sección.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ msg: 'Token de acceso invalido.' });
        
        req.user = decoded;
        next();
    });
};