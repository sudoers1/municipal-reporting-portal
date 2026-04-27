export default function SearchBar(){
    return(
        <section className="flex gap-1">
            <section className="bg-gray-300 w-100 h-6 rounded-bl-full rounded-tl-full">
                <section className="h-6 p-2 flex justify-between items-center">
                    <input type="text"
                        className="text-wrap w-90 p-2" 
                        placeholder="Search" 
                        // value={query}
                    />
                    <button>
                        <img 
                            src="/search-outline.svg" alt=""
                            className="w-4 h-4" 
                        />
                    </button>
                </section>
            </section>
            <section className="bg-gray-300 w-12 h-6 flex justify-center items-center rounded-br-full rounded-tr-full">
                <button>
                    <img src="/funnel-outline.svg" alt="" 
                        className="w-6 h-6" 
                    />
                </button>
            </section>
        
        </section>
    )
}