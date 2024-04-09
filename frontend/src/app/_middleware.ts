import { NextRequest, NextResponse } from 'next/server';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {currentUser} from "@/app/services/Auth.services";


interface ITokenPayload extends JwtPayload {
    exp?: number;
}

// Função para verificar a validade do token
const isTokenValid = (token: string): boolean => {
    if (!token) {
        return false;
    }
    const decodedToken: ITokenPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp ? decodedToken.exp > currentTime : false;
};

export function middleware(req: NextRequest) {
console.log(req.url)
    const token = currentUser.token;
    if (!isTokenValid(token)) {
        return NextResponse.redirect('/login');
    }
    return NextResponse.next();
}