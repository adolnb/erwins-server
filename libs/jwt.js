import jwt from 'jsonwebtoken';

export function accessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "5h",
            },
            (err, token) => {
                if (err) reject(err)
                    resolve(token)
            }
        );
    });
}