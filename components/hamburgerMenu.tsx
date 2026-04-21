import { useState } from 'react';

export default function Hamburger(){

    const[isOpen, setIsOpen] = useState(false);

    function handleMenu(){
       setIsOpen(!isOpen);
    }

    return(
        <section className="flex flex-col items-end relative ">
            <img src="/menu-outline.svg" alt="Menu-icon that is clickable" className="w-8 sm:hidden" onClick={handleMenu} />
            { isOpen && (
                <ul className='text-white bg-green-500 w-48 p-4 mt-2 flex flex-col gap-2 absolute top-full right-0 shadow-xl z-50 sm:hidden'>
                    <li><a href={"/dashboard"}>Dashboard</a></li>
                    <li><a href={"/reports"}>Reports</a></li>
                    <li><a href="">About</a></li>
                    <li><a href="">Contact</a></li>
                </ul>
            )
            }
        </section>
    )
}