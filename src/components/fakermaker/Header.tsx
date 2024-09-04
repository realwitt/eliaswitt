
type HeaderProps = {
    title: string
}

export function Header({title} : HeaderProps) {
    return(
        <div className="flex flex-row max-w-[1440px] mt-3 mb-4 mx-auto">
            <div className="grow h-0.5 bg-line mt-4"/>
            <div className="flex-none flex flex-row justify-start w-full max-w-[1300px]">
                <div className="min-w-4 md:min-w-8 md:w-7 h-0.5 bg-line mt-4" />
                <div className="flex-1 flex flex-row min-w-[300px] md:max-w-[414px]">
                    <h3 className="text-nowrap ml-1 md:ml-2 mr-2 h-full pt-[3px] text-lg md:text-base text-subtle_blue font-semibold">
                        {title}
                    </h3>
                    <div className="grow bg-line h-0.5 mt-4" />
                </div>
                <div className="grow mt-3.5 max-w-[300px]" />
            </div>
            <div className="grow"></div>
        </div>
    )
}
