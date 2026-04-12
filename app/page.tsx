"use client";
import '@/styles/homepage.css'
import Link from 'next/link'
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

function loginbutton(socialProvider:string)
{
  console.log("foobar");
  authClient.signIn.social({
              provider: socialProvider,
              callbackURL: "/dashboard",
            })
  return ;
}

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  return (
      <main >
        <header>
          <img
            src="/images/logobig.jpg"
            className="logobig"
            alt="LOGO"
            style={{position:'fixed', left:0,height:'8vh',width:'8vw'}}
          />
            <button
              onClick={() => setShowLogin(true)}
              className="smallbutton"
            >
              Sign in
            </button>
          
        </header>
        {showLogin && (
        <section className="card">
          
          <img
            src="/images/logobig.jpg"
            className="logobig"
            alt="LOGO"
          />
          <h1 className="heading">Sign in using:</h1>
          

          <ul>
            <li><button onClick={()=>loginbutton("google")} className="button"><img src="/images/logo-long-google.png" style={{height:30}}/></button></li>

            <li><button onClick={()=>loginbutton("facebook")} className="button"><img src="/images/logo-long-facebook.png" style={{height:30}}/></button></li>
            
            <li><button onClick={()=>loginbutton("linkedin")} className="button"><img src="/images/logo-long-linkedin.png" style={{height:30}}/></button></li>
            
            <li><button onClick={()=>loginbutton("discord")} className="button"><img src="/images/logo-long-discord.png" style={{height:30}}/></button></li>
        
            <li><button onClick={()=>loginbutton("github")} className="button"><img src="/images/logo-long-github.png" style={{height:30}}/></button></li>
    
          </ul>
          <button onClick={() => setShowLogin(false)} className="smallbutton">maybe later...</button>
          

        </section>
      )}
      </main>
  );
}
