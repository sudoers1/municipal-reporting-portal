import { signUpAction } from "../app/actions/auth";

export default function SignUpPage(){
    return(
        <section className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Sign Up</h1>
            <form action={signUpAction} className="flex flex-col gap-3 w-64">
                <input type="text" name="name" placeholder="Name" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Sign Up</button>
            </form>
        </section>
    )
}

