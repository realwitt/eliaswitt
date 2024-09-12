import {useState} from "react";

type ButtonProps = {
    title: string
    clicked(): void
    countToShow?: number // the number of instances that exist of a maker
}

export function Button({title, clicked, countToShow}: ButtonProps) {
    const [isToggled, setIsToggled] = useState(false)
    function toggleIfNoCount() {
        if (!countToShow) {
            setIsToggled(!isToggled)
            return
        }
    }

    return (
        <button
            className={`group ${(isToggled && countToShow !== 0 || countToShow && countToShow > 0) ? 
                'bg-accent_pink' : 
                'bg-accent_purple'} 
                border-2 border-transparent active:bg-accent_pink_light relative text-sm font-semibold transition duration-150 
                text-nowrap mr-7 mb-5 px-[18px] pt-0.5 pb-[2.5px] rounded-lg md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink`}
            onClick={() => {clicked(); toggleIfNoCount()}}>
            {title}
            <div className={`absolute ${countToShow && countToShow > 1 ? 'md:group-hover:shadow-[0_0_8px_0_rgba(0,0,0,0.3)] md:group-hover:shadow-subtle_blue transition duration-200 border-2 border-accent_pink w-[26px] h-[26px] leading-[22px] rounded-full bg-dark_blue text-light_blue text-xs text-center -top-3.5 -right-3' : 'invisible'}`}>
                {countToShow}
            </div>
        </button>
    )
}