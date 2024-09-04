export function Copyright(): any {
    const date = new Date().getFullYear()
    return(
        <div className="relative mx-auto pl-2.5 my-auto font-semibold text-line">
            <span className="-top-[1px] -left-1 text-xl absolute">©</span> {date} Elias Witt
        </div>
    )
}