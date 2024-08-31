import {useState} from "react";

export function Menu(): any {
    const [showMenu, setShowMenu]  = useState(false)

    return (
        <>
            <div className="hover:cursor-pointer -mt-1 mr-5 pr-10 md:pr-0 md:invisible md:absolute"
                 onClick={() => {
                     setShowMenu(!showMenu);
                     console.log(showMenu)
                 }}>
                {/* cheeseburger-seeds */}
                <svg
                    className={`transition duration-300 absolute px-0.5 w-[38px] h-[38px] mt-2.5 z-10 ${showMenu ? 'fill-[#ebf3c7]' : 'fill-subtle_blue'}`}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <circle className="cls-1" cx="128" cy="128" r="16"/>
                    <circle className="cls-1" cx="256" cy="96" r="16"/>
                    <circle className="cls-1" cx="384" cy="128" r="16"/>
                </svg>
                {/* cheeseburger-buns */}
                <svg
                    className={`transition duration-300 absolute px-0.5 w-[38px] h-[38px] mt-2.5 ${showMenu ? 'fill-[#efa55a]' : 'fill-accent_purple'}`}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path className="cls-1"
                          d="M32,194.9a26.66,26.66,0,0,1,.6-5.6C37.9,168.3,78.8,32,256,32S474.1,168.3,479.4,189.3a21.36,21.36,0,0,1,.6,5.6A29.06,29.06,0,0,1,450.9,224H61.1A29.06,29.06,0,0,1,32,194.9Z"/>
                    <path className="cls-1"
                          d="M32,400a16,16,0,0,1,16-16H464a16,16,0,0,1,16,16v16a64.06,64.06,0,0,1-64,64H96a64.06,64.06,0,0,1-64-64Z"/>
                </svg>
                {/* cheeseburger-cheese */}
                <svg
                    className={`transition duration-300 absolute px-0.5 w-[38px] h-[38px] mt-2.5 ${showMenu ? 'fill-[#e5973f]' : 'fill-accent_purple'}`}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path className="cls-1"
                          d="M211.9,256H428a39.37,39.37,0,0,0-22.1,6.7c-22.7,15.2-45.5,30.3-68.2,45.5a31.87,31.87,0,0,1-35.5,0c-22.7-15.2-45.5-30.3-68.2-45.5a39.37,39.37,0,0,0-22.1-6.7Z"/>
                </svg>
                {/* cheeseburger-patty */}
                <svg
                    className={`transition duration-300 absolute px-0.5 w-[38px] h-[38px] mt-2.5 ${showMenu ? 'fill-[#993c2f]' : 'fill-subtle_blue'} `}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                        d="M302.2,308.2,234,262.7a39.37,39.37,0,0,0-22.1-6.7H64a48,48,0,0,0,0,96H448a48,48,0,0,0,0-96H428.1a39.37,39.37,0,0,0-22.1,6.7l-68.2,45.5a31.87,31.87,0,0,1-35.5,0Z"/>
                </svg>
            </div>

            {/* mobile menu */}
                <div className="absolute top-0 mt-[48px] overflow-hidden">
                    <div className={`group/menu md:absolute md:h-0 w-[100vw] bg-line transition-transform duration-200 ease-in-out
                  ${showMenu ? '' : '-translate-y-full'}`}>
                        <a className="flex group hover:bg-accent_pink" href="/portfolio">
                            {/* !Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc */}
                            <svg className="h-6 mt-[19px] ml-4 fill-accent_purple group-hover:fill-dark_blue "
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 512 512">
                                <path className="fa-secondary" opacity=".4"
                                      d="M0 256c0 7.8 .3 15.5 1 23.1C73.2 304.7 160.8 320 256 320s182.8-15.3 255-40.9c.7-7.6 1-15.3 1-23.1c0-10.8-.7-21.5-2-32l-62 0 0-64-80 0 0-64 48 0 0-39.9C372.2 21 316.5 0 256 0C114.6 0 0 114.6 0 256zm6.8 58.8C33.4 427.9 134.9 512 256 512c76.5 0 145.1-33.5 192-86.7l0-41.3-64 0 0-41.2c-40.7 6-83.7 9.2-128 9.2c-91.3 0-176.6-13.6-249.2-37.2zM272 160a80 80 0 1 1 -160 0 80 80 0 1 1 160 0z"/>
                                <path className="fa-primary"
                                      d="M224 160a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-112 0a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zM6.8 314.8C4.1 303.2 2.1 291.3 1 279.1C73.2 304.7 160.8 320 256 320s182.8-15.3 255-40.9c-1.1 12.2-3 24.1-5.8 35.8C432.6 338.4 347.3 352 256 352s-176.6-13.6-249.2-37.2z"/>
                            </svg>
                            <div
                                className="py-4 pl-4 text-xl font-bold text-accent_purple block group-hover:text-dark_blue group-hover:border-b-[1.5px] group-hover:border-accent_pink">projects
                            </div>
                        </a>
                        <div className="h-[1.5px] bg-accent_purple group-hover/menu:absolute group-hover:bg-none"/>
                        <a className="flex group hover:bg-accent_pink" href="/musings">
                            {/* !Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc */}
                            <svg className="h-6 mt-[18px] ml-3.5 fill-accent_purple group-hover:fill-dark_blue " xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 576 512">
                                <path className="fa-secondary" opacity=".4"
                                      d="M64 32l352 0c35.3 0 64 28.7 64 64l0 24 0 1.4c0 4.2-1.7 8.3-4.7 11.3l-21.7 21.7c-3.1 3.1-3.1 8.2 0 11.3l21.7 21.7c3 3 4.7 7.1 4.7 11.3l0 1.4 0 16 0 1.4c0 4.2-1.7 8.3-4.7 11.3l-21.7 21.7c-3.1 3.1-3.1 8.2 0 11.3l21.7 21.7c3 3 4.7 7.1 4.7 11.3l0 1.4 0 56-56 0-1.4 0c-4.2 0-8.3 1.7-11.3 4.7l-21.7 21.7c-3.1 3.1-8.2 3.1-11.3 0l-21.7-21.7c-3-3-7.1-4.7-11.3-4.7l-1.4 0-24 0c-17.7 0-32 14.3-32 32l0 16c0 44.2-35.8 80-80 80s-80-35.8-80-80l0-136 0-1.4c0-4.2 1.7-8.3 4.7-11.3l21.7-21.7c3.1-3.1 3.1-8.2 0-11.3l-21.7-21.7c-3-3-4.7-7.1-4.7-11.3l0-1.4 0-24 0-64c0-35.3-28.7-64-64-64z"/>
                                <path className="fa-primary"
                                      d="M32 160l96 0 0-64c0-35.3-28.7-64-64-64S0 60.7 0 96l0 32c0 17.7 14.3 32 32 32zM288 384l0 16c0 44.2-35.8 80-80 80l272 0c53 0 96-43 96-96c0-17.7-14.3-32-32-32l-120 0-1.4 0c-4.2 0-8.3 1.7-11.3 4.7l-21.7 21.7c-3.1 3.1-8.2 3.1-11.3 0l-21.7-21.7c-3-3-7.1-4.7-11.3-4.7l-1.4 0-24 0c-17.7 0-32 14.3-32 32z"/>
                            </svg>
                            <div
                                className="py-4 pl-4 text-xl font-bold text-accent_purple block group-hover:text-dark_blue group-hover:border-b-[1.5px] group-hover:border-accent_pink">musings
                            </div>
                        </a>
                    </div>
                </div>

        </>
    );
}