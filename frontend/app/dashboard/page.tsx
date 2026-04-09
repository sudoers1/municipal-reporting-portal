"use client";
import '@/styles/homepage.css'
import { useState } from "react";
import Link from 'next/link'
import { authClient } from "@/lib/auth-client";


export default function dashboard() {
  return (
      <main >
        <header>
          <img
            src="/images/logobig.jpg"
            className="logobig"
            alt="LOGO"
            style={{position:'fixed', left:0,height:'8vh',width:'8vw'}}
          />
            <Link
              href="/"
              className="smallbutton"
            >
              return to Sign in
            </Link>
          
        </header>
        <section className="card">
          
          <img
            src="/images/logobig.jpg"
            className="logobig"
          />
          <h1 className="heading">nothing to see here</h1>

        </section>
      </main>
  );
}
