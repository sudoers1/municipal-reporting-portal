import { neon, NeonQueryFunction } from '@neondatabase/serverless';



let test: string = process.env.NEON_CONNECTION_STRING!;
export const sql = neon(test);
