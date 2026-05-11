import { Request, Response, NextFunction } from 'express';

export const logFullCycle = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const timestamp = new Date().toLocaleTimeString();
    
    // 1. Cores ANSI
    const reset = '\x1b[0m';
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const magenta = '\x1b[35m';
    const green = '\x1b[32m';
    const red = '\x1b[31m';

    // --- LOG DE ENTRADA ---
    console.log(`\n${magenta}>>> [${timestamp}] REQUISIÇÃO${reset}`);
    console.log(`${cyan}${req.method}${reset} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`${yellow}Body (In):${reset}`, JSON.stringify(req.body, null, 2));
    }

    // 2. INTERCEPTOR DE SAÍDA
    const oldJson = res.json;
    res.json = (body) => {
        const duration = Date.now() - start;
        const colorStatus = res.statusCode >= 400 ? red : green;

        // --- LOG DE SAÍDA ---
        console.log(`${yellow}Status:${reset} ${colorStatus}${res.statusCode}${reset}`);
        console.log(`${yellow}Body (Out):${reset}`, JSON.stringify(body, null, 2));
        console.log(`${magenta}<<< [${new Date().toLocaleTimeString()}] RESPOSTA (${duration}ms)${reset}`);
        
        return oldJson.call(res, body);
    };

    next();
};
