import type {Maker} from "./types/Maker";
import type {Maker_Date} from "./types/MakerDate";
import type {Maker_Price} from "./types/MakerPrice";
import type {Maker_Name} from "./types/MakerName";
import {useState} from "react";

type ActiveProps = {
    selectedMakers: Array<Maker> | undefined
    toggleNullable(index: number): void
    deleteSelectedMaker(index: number): void
    nickNameUpdate(update: string, index: number): void
}

export function MakersSelected({selectedMakers, deleteSelectedMaker, toggleNullable, nickNameUpdate}: ActiveProps) {

    function renderOptions(index: number) {
        if (selectedMakers && selectedMakers[index]) {
            switch (selectedMakers[index].type) {
                case 'NAME':
                    (selectedMakers[index] as Maker_Name).nameType
                    return (
                        <>
                            {/*drop down of name types*/}
                        </>
                    )
                case 'PRICE':
                    (selectedMakers[index] as Maker_Price).range
                    return (
                        <>
                            {/*input for rangeStart*/}
                            {/*input for rangeEnd*/}
                        </>
                    )
                case 'DATE':
                    (selectedMakers[index] as Maker_Date).range
                    return (
                        <div className="absolute flex flex-col -left-5 px-[18px] bg-dark_blue pt-0.5 pb-2.5 mt-[6px] rounded-b-lg rounded-tr-md border-2 border-accent_pink">
                            {/* input */}
                            <label className="text-[10px] text-light_blue -mb-0.5" htmlFor="nickName">
                                name
                            </label>
                            <input
                                className={`bg-transparent text-accent_pink border-transparent border-b-accent_pink border-2 focus:outline-none focus:ring-0`}
                                name="nickname"
                                id="nickName"
                                placeholder="maker nickname"
                                defaultValue={selectedMakers[index].nickName}
                                onChange={(e) => nickNameUpdate(e.target.value, index)}
                            />

                            <label className="text-[10px] text-light_blue mt-2 -mb-0.5" htmlFor="nickName">
                                start
                            </label>
                            <div className="text-accent_pink">JAN-01-2024</div>

                            <label className="text-[10px] text-light_blue mt-2 -mb-0.5" htmlFor="nickName">
                                end
                            </label>
                            <div className="text-accent_pink">JAN-01-2024</div>
                        </div>
                    )
                default:
                    break
            }
        }
    }

    if (!selectedMakers || selectedMakers.length === 0) {
        return <div></div>;
    }

    return (
        <div className="flex flex-wrap items-start px-5 md:px-10 max-w-[1300px] mx-auto">
            {selectedMakers.map((maker, index) => (
                // make wrapper div that is just flex container, make it flex-col
                // ~~~~~~~~~~~~~~~~~~
                // <div class="flex flex-col">
                //      < selectedMakerTitle />
                //      < selectedMakerOptions />
                // </div>
                <div key={index}
                     className="group select-none inline-block cursor-pointer bg-accent_pink border-2 border-transparent active:bg-accent_pink_light relative text-sm font-semibold transition duration-150 text-nowrap mr-7 mb-5 px-[18px] pt-1 pb-1 rounded-lg rounded-tr-md hover:rounded-b-none md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink mt-2"
                     onClick={() => {
                         toggleNullable(index);
                         console.log(maker)
                     }}
                >
                    <div
                        className={`absolute -top-5 right-0 text-[10px] ${maker.nullable ? 'text-accent_pink' : 'text-subtle_blue'}`}>
                        nullable
                    </div>
                    {maker.nickName ? maker.nickName.toLowerCase() : maker.type.toLowerCase()}
                    <svg
                        className={'fill-accent_purple bg-dark_blue h-7 w-7 py-1.5 rounded-full -top-2 -left-3.5 absolute border-2 border-accent_pink invisible group-hover:visible transition duration-200 md:hover:shadow-accent_pink md:group-hover:shadow-[0_0_8px_0_rgba(0,0,0,0.3)] md:group-hover:shadow-subtle_blue hover:border-accent_purple ease-in-out hover:scale-110'}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        onClick={() => deleteSelectedMaker(index)}
                    >
                        <path
                            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
                    </svg>
                    <div className="invisible z-50 absolute group-hover:visible group-hover:relative">
                        {renderOptions(index)}
                    </div>
                </div>
            ))}
        </div>

    );
}