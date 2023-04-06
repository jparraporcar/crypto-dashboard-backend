import * as z from 'zod'

export const userSchemaZod = z
    .object({
        userName: z
            .string()
            .regex(/[A-Za-z0-9]+/, {
                message: 'Only letters/numbers and minimum 5',
            })
            .min(5, { message: 'Only letters/numbers and minimum 5' })
            .max(15, { message: 'Maximum 15 characters' }),
        email: z.string().email(),
        password: z
            .string()
            .min(8, {
                message: 'Minimum 8 letters/numbers and 1 special character',
            })
            .regex(/([A-Za-z0-9]+)([^A-Za-z0-9])/, {
                message: 'Minimum 8 letters/numbers and 1 special character',
            }),
        passwordConf: z
            .string()
            .min(8, {
                message: 'Minimum 8 letters/numbers and 1 special character',
            })
            .regex(/([A-Za-z0-9]+)([^A-Za-z0-9])/, {
                message: 'Minimum 8 letters/numbers and 1 special character',
            }),
    })
    .refine((data) => data.password === data.passwordConf, {
        message: "Passwords don't match",
        path: ['passwordConf'],
    })

export type TUserSchemaZod = z.infer<typeof userSchemaZod>
