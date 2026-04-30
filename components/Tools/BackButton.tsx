export default function BackButton(){
    return(
        <section className="pl-4 pt-2">
            <button>
                <a href="/admin">
                    <img className="w-8" src="/chevron-back-circle-outline.svg" alt="chevron in a circle used as a return to home button" />
                </a>
            </button>
        </section>
    )
}