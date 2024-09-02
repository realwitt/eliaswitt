import {useState} from "react";

type ButtonProps = {
    title: string
    clicked(): void
    showCount?: boolean
}

export function Button({title, clicked, showCount}: ButtonProps) {
    const [timesClicked, setTimesClicked] = useState(0)
    return (
        <button
            className={`group ${((!showCount && timesClicked % 2 !== 0) || showCount && timesClicked > 0) ? 'bg-accent_pink hover:border-accent_purple' : 'bg-accent_purple hover:border-accent_pink'} border-2 border-transparent active:bg-subtle_blue relative text-sm font-semibold transition duration-200 text-nowrap mr-7 mb-5 px-[18px] py-0.5 rounded-lg rounded-tr-md rounded-bl-md`}
            onClick={() => {
                clicked();
                setTimesClicked(timesClicked < 100 ? timesClicked + 1 : timesClicked)
            }}>
            {title}
            <div
                className={`absolute ${showCount && timesClicked > 1 ? 'group-hover:border-accent_purple transition duration-200 border-2 border-accent_pink w-[26px] h-[26px] leading-[22px] rounded-full bg-dark_blue text-light_blue text-xs text-center -top-3.5 -right-3' : 'invisible'}`}>{timesClicked}</div>
        </button>
    )
}