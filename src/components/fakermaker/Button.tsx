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
            className={`group ${((!showCount && timesClicked % 2 !== 0) || showCount && timesClicked > 0) ? 
                'bg-accent_pink' : 
                'bg-accent_purple'} 
                border-2 border-transparent  active:bg-subtle_blue relative text-sm font-semibold transition duration-150 
                text-nowrap mr-7 mb-5 px-[18px] pt-0.5 pb-[2.5px] rounded-lg md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink`}
            onClick={() => {
                clicked();
                setTimesClicked(timesClicked < 100 ? timesClicked + 1 : timesClicked)
            }}>
            {title}
            <div className={`absolute ${showCount && timesClicked > 1 ? 'md:group-hover:shadow-[0_0_8px_0_rgba(0,0,0,0.3)] md:group-hover:shadow-subtle_blue transition duration-200 border-2 border-accent_pink w-[26px] h-[26px] leading-[22px] rounded-full bg-dark_blue text-light_blue text-xs text-center -top-3.5 -right-3' : 'invisible'}`}>
                {timesClicked}
            </div>
        </button>
    )
}