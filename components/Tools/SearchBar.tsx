export default function SearchBar(){
    return(

        <section className="bg-white flex flex-col items-center" >
            <form action=""
                className="w-full max-w-2xl"
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