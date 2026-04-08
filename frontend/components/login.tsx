import { loginAction } from "../app/actions/auth";

export default function LoginPage(){
    return(
        <section className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <form action={loginAction} className="flex flex-col gap-3 w-64">
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Sign In</button>
            </form>
        </section>
    )
}

