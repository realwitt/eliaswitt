export function Copyright(): any {
    const date = new Date().getFullYear()
    return(
        <div className="relative mx-auto my-auto font-semibold text-line">
            <span className="-top-[1px] -left-4 text-xl absolute">©</span> {date} Elias Witt
        </div>
    )
}