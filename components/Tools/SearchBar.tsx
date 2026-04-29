export default function SearchBar(){
    return(
        // <section className="flex gap-1">
        //     <section className="bg-gray-300 w-100 h-6 rounded-bl-full rounded-tl-full">
        //         <section className="h-6 p-2 flex justify-between items-center">
        //             <input type="text"
        //                 className="text-wrap w-90 p-2" 
        //                 placeholder="Search" 
        //                 // value={query}
        //             />
        //             <button>
        //                 <img 
        //                     src="/search-outline.svg" alt=""
        //                     className="w-4 h-4" 
        //                 />
        //             </button>
        //         </section>
        //     </section>
        //     <section className="bg-gray-300 w-12 h-6 flex justify-center items-center rounded-br-full rounded-tr-full">
        //         <button>
        //             <img src="/funnel-outline.svg" alt="" 
        //                 className="w-6 h-6" 
        //             />
        //         </button>
        //     </section>
        
        // </section>

        <section className="bg-white p-4 flex flex-col items-center" >
            <form action=""
                className="w-full max-w-2xl mb-8"
            >
                <section className="relative">
                    <input type="text" 
                        className="bg-white text-base w-full px-5 py-3 pr-20 border border-gray-200 rounded-full shadow-md transition-shadow duration-200 hover:shadow-lg focus:border-gray-300 focus:outline-none"
                        placeholder="Search Complaints"
                    />
                    <section className="mr-4 mt-3 flex items-center absolute right-0 top-0">
                        <button
                            type="submit"
                            className="text-gray-400 mr-3 hover:text-gray-600"
                        >
                            <img src="/search-outline.svg" alt="search magnifying glass"
                                className="w-6"
                            />
                        </button>
                        <button
                            type="submit"
                            className="text-gray-400 mr-3 hover:text-gray-600"
                        >
                            <img src="/options-outline.svg" alt="filtering options sliders" 
                                className="w-6"
                            />
                        </button>
                    </section>
                </section>
            </form>
        </section>
    )
}