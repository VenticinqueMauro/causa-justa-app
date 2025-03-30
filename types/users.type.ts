export type RegisterData = {
    fullName: string;
    email: string;
    password: string;
    cuitOrDni: string;
    role: string;
}

export type LoginData = {
    email: string;
    password: string;
}