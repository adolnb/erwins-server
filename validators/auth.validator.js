import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string({
        required_error: "El campo de nombre es requerido."
    }),
    lastname1: z.string({
        required_error: "El campo de apellido paterno es requerido."
    }),
    lastname2: z.string({
        required_error: "El campo de apellido materno es requerido."
    }),
    email: z.string({
        required_error: "El correo es requerido."
    }).email({
        message: "Formato de correo no valido."
    }),
    password: z.string({
        required_error: "Debes proporcionar una contraseña para la cuenta."
    }).min(6, {
        message: "La contraseña debe incluir al menos 5 caracteres."
    }),
    type: z.string({
        required_error: "El campo de tipo es requerido."
    }).default('PROVEEDOR')
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "El correo es requerido."
    }).email({
        message: "Formato de correo no valido."
    }),
    password: z.string({
        required_error: "Debes proporcionar la contraseña."
    }).min(6, {
        message: "La contraseña es de al menos 5 caracteres."
    })
});