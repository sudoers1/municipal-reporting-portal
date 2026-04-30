import {auth} from "@/lib/auth";

export async function getSession(req: Request){
    return await auth.api.getSession({
        headers: req.headers,
    });
}

export async function requireSession(req: Request){
    const session = await getSession(req);

    if(!session){
        throw new Error("Unauthorized");
    }

    return session;
}

export function requireRole(session: any, roles: string[]){
    if(!roles.includes(session.user.role)){
        throw new Error("Forbidden");
    }
}

export function withAuth(roles: string[], handler: Function){
    return async (req: Request)=> {
    const session = await requireSession(req);
    requireRole(session, roles);
    
    return handler(req, session);
 }}