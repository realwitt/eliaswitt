import type {Maker} from "./types/Maker";
import type {Maker_Date} from "./types/MakerDate";
import type {Maker_Price} from "./types/MakerPrice";
import type {Maker_Name} from "./types/MakerName";
import {useState} from "react";
import type {MakerNameTypeEnum} from "./enums/MakerNameTypeEnum";

type ActiveProps = {
    selectedMakers: Array<Maker> | undefined
    toggleNullable(index: number): void
    deleteSelectedMaker(index: number): void
    nickNameUpdate(update: string, index: number): void
    nameTypeUpdate(update: MakerNameTypeEnum, index: number): void
}

export function MakersSelected({
                                   selectedMakers,
                                   deleteSelectedMaker,
                                   toggleNullable,
                                   nickNameUpdate,
                                   nameTypeUpdate
                               }: ActiveProps) {
    const [inputSize, setInputSize] = useState(12)

    function calculateInputSize(inputValue: string) {
        if (inputValue.length > 9) {
            setInputSize(inputValue.length + 2)
        } else {
            setInputSize(12)
        }
    }

    function optionsDialog(index: number) {
        if (selectedMakers && selectedMakers[index]) {
            switch (selectedMakers[index].type) {
                case 'NAME':
                    const currentMakerNameType = (selectedMakers[index] as Maker_Name).nameType
                    const arrayOfNameTypes = ['FIRST', 'LAST', 'COMPANY']
                    return (
                        <div
                            className="absolute flex flex-col -left-5 px-[18px] bg-dark_blue pt-0.5 pb-3.5 mt-[6px] rounded-b-lg rounded-tr-md border-2 border-accent_pink group-hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] group-hover:shadow-accent_pink">
                            <label className="text-[10px] text-light_blue -mb-0.5 mt-1 " htmlFor="nickName">
                                nickname
                            </label>
                            <input
                                className={`bg-transparent mt-1 text-sm text-accent_pink border-0 border-b-2 border-subtle_blue focus:border-accent_pink focus:outline-none focus:ring-0 placeholder:text-subtle_blue`}
                                name="nickname"
                                id="nickName"
                                placeholder={`${selectedMakers[index].type.toLowerCase()}...`}
                                defaultValue={selectedMakers[index].nickName}
                                size={inputSize}
                                maxLength={20}
                                onChange={(e) => {
                                    nickNameUpdate(e.target.value, index);
                                    calculateInputSize(e.target.value)
                                }}
                            />
                            <label className="text-[10px] text-light_blue mt-3 -mb-0.5" htmlFor="nickName">
                                type
                            </label>
                            {arrayOfNameTypes.map((name, k) => (
                                // fix weird floating checkmark with 'hidden'
                                <div className={`hidden group-hover:flex justify-between group/nameType cursor-pointer ${k === arrayOfNameTypes.length - 1 ? '' : 'border-line border-b-2'}`} key={k}
                                     onClick={() => nameTypeUpdate(name as MakerNameTypeEnum, index)}>
                                    <div
                                        className={`${currentMakerNameType === name ? 'text-accent_pink' : 'text-subtle_blue group-hover/nameType:text-light_blue'} text-sm mt-1 pb-0.5`}>
                                        {name.toLowerCase()}
                                    </div>
                                    {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
                                    <svg
                                        className={`fill-accent_pink h-4 w-4 mt-1.5 mr-1 ${currentMakerNameType === name ? 'visible' : 'invisible'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512">
                                        <path
                                            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                    </svg>
                                </div>
                            ))}

                        </div>
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
                        <div
                            className="absolute flex flex-col -left-5 px-[18px] bg-dark_blue pt-0.5 pb-3.5 mt-[6px] rounded-b-lg rounded-tr-md border-2 border-accent_pink group-hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] group-hover:shadow-accent_pink">
                            {/* input */}
                            <label className="text-[10px] text-light_blue mt-1.5" htmlFor="nickName">
                                nickname
                            </label>
                            <input
                                className={`bg-transparent mt-1 text-sm text-accent_pink border-0 border-b-2 border-subtle_blue focus:border-accent_pink focus:outline-none focus:ring-0 placeholder:text-subtle_blue`}
                                name="nickname"
                                id="nickName"
                                placeholder={`${selectedMakers[index].type.toLowerCase()}...`}
                                defaultValue={selectedMakers[index].nickName}
                                size={inputSize}
                                maxLength={20}
                                onChange={(e) => {
                                    nickNameUpdate(e.target.value, index);
                                    calculateInputSize(e.target.value)
                                }}
                            />

                            <label className="text-[10px] text-light_blue mt-3 -mb-0.5" htmlFor="nickName">
                                start
                            </label>
                            <div className="text-accent_pink">JAN-01-2024</div>

                            <label className="text-[10px] text-light_blue mt-2.5 -mb-0.5 " htmlFor="nickName">
                                end
                            </label>
                            <div className="text-accent_pink">JAN-01-2024</div>
                        </div>
                    )
                default:
                    return (
                        <div
                            className="absolute flex flex-col -left-5 px-[18px] bg-dark_blue pt-0.5 pb-3.5 mt-[6px] rounded-b-lg rounded-tr-md border-2 border-accent_pink group-hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] group-hover:shadow-accent_pink">
                            <label className="text-[10px] text-light_blue -mb-0.5 mt-1 " htmlFor="nickName">
                                nickname
                            </label>
                            <input
                                className={`bg-transparent mt-1 text-sm text-accent_pink border-0 border-b-2 border-subtle_blue focus:border-accent_pink focus:outline-none focus:ring-0 placeholder:text-subtle_blue`}
                                name="nickname"
                                id="nickName"
                                placeholder={`${selectedMakers[index].type.toLowerCase()}...`}
                                defaultValue={selectedMakers[index].nickName}
                                size={inputSize}
                                maxLength={20}
                                onChange={(e) => {
                                    nickNameUpdate(e.target.value, index);
                                    calculateInputSize(e.target.value)
                                }}
                            />
                        </div>
                    )
            }
        }
    }

    if (!selectedMakers || selectedMakers.length === 0) {
        return <div></div>;
    }

    return (
        <div className="flex flex-wrap items-start px-5 md:px-10 max-w-[1300px] mx-auto">
            {selectedMakers.map((maker, index) => (
                    <div className="group" key={index}>
                        <div key={index}
                             className="select-none inline-block cursor-pointer bg-accent_pink border-2 border-transparent active:bg-accent_pink_light relative text-sm font-semibold text-nowrap mr-7 mb-5 px-[18px] pt-1 pb-1 rounded-lg rounded-tr-md group-hover:rounded-b-none group-hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] group-hover:shadow-accent_pink mt-2"
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
                                className={'fill-accent_purple bg-dark_blue h-7 w-7 py-1.5 rounded-full -top-2 -left-3.5 absolute border-2 border-accent_pink invisible group-hover:visible transition duration-200 md:hover:shadow-accent_pink group-hover:shadow-[0_0_8px_0_rgba(0,0,0,0.3)] group-hover:shadow-subtle_blue hover:border-accent_purple ease-in-out hover:scale-110'}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                onClick={() => deleteSelectedMaker(index)}
                            >
                                <path
                                    d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
                            </svg>
                        </div>
                        <div
                            className="invisible absolute group-hover:visible -top-[26px] left-5 group-hover:relative z-50">
                            {optionsDialog(index)}
                        </div>
                    </div>
                )
            )}
        </div>

    )
}