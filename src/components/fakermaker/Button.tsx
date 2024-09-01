type ButtonProps = {
    title: string
    clicked(): void
}
export function Button({title, clicked} : ButtonProps) {
    return(
        <button className={`bg-green-700 m-8`} onClick={() => clicked()}>
            {title}
        </button>
    )
}