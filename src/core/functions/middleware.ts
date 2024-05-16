import { NextFunction, Request, Response } from "express";

export function ensureToken(req: Request, res: Response, next : NextFunction) {
    const bearerHeader = req.headers["authorization"]
    if(bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.headers["authorization"] = bearerToken;
        return next();
    }

    res.status(401).json({
        message: "The Authorization Bearer Token is missing!"
    })
}

