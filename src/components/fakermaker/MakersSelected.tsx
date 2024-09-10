// import type {Maker} from "./types/Maker";
//
// type ActiveProps = {
//     selectedMakers: Array<Maker> | undefined
//     deleteSelectedMaker(index: number): void
// }
//
// export function MakersSelected({selectedMakers, deleteSelectedMaker}: ActiveProps) {
//
//     if (selectedMakers) {
//         for (let i = 0; i < selectedMakers.length; i++) {
//             if (selectedMakers[i].count && selectedMakers[i].count! > 0) { // ts still thinking selectedMakers[i].count could possibly be null for some reason... no idea why
//                 {
//                     selectedMakers.map((maker, index) => (
//                         <>
//                             <div className="group inline-block cursor-pointer bg-accent_pink border-2 border-transparent active:bg-subtle_blue relative text-sm font-semibold transition duration-150 text-nowrap mr-7 mb-5 px-[18px] pt-1 pb-1 rounded-lg md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink">
//                                 {selectedMakers[i]?.nickName ? selectedMakers[i]?.nickName?.toLowerCase() : selectedMakers[i].type.toLowerCase()}
//                                 {/*absolute invisible group-hover:visible*/}
//                                 {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
//                                 <svg
//                                     className={'fill-accent_purple bg-dark_blue h-7 w-7 py-1.5 rounded-full -top-2 -left-3.5 absolute border-2 border-accent_pink invisible group-hover:visible transition duration-200 md:hover:shadow-accent_pink md:group-hover:shadow-[0_0_8px_0_rgba(0,0,0,0.3)] md:group-hover:shadow-subtle_blue hover:border-accent_purple ease-in-out hover:scale-110'}
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 448 512"
//                                     onClick={() => deleteSelectedMaker(i)}
//                                 >
//                                     <path
//                                         d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
//                                 </svg>
//                             </div>
//                         </>
//                     ))
//                 }
//             }
//         }
//
//     }
// }


import React from 'react';
import type {Maker} from "./types/Maker";

type ActiveProps = {
    selectedMakers: Array<Maker> | undefined
    deleteSelectedMaker(index: number): void
}

export function MakersSelected({selectedMakers, deleteSelectedMaker}: ActiveProps) {

    if (!selectedMakers || selectedMakers.length === 0) {
        return <div></div>;
    }

    return (
        <div>
            {selectedMakers.map((maker, index) => (
                <div key={index}
                     className="group inline-block cursor-pointer bg-accent_pink border-2 border-transparent active:bg-subtle_blue relative text-sm font-semibold transition duration-150 text-nowrap mr-7 mb-5 px-[18px] pt-1 pb-1 rounded-lg md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink">
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
                </div>
            ))}
        </div>
    );
};