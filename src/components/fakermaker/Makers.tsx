import {Button} from "./Button.tsx";
import {useState} from "react";
import type {Maker} from "./types/Maker";

type FakerProps = {
    availableMakers: Array<Maker>
    updatedMakerIndex(index: number): void
}


export function Makers({availableMakers, updatedMakerIndex} : FakerProps) {
    const renderedMakers = []
    for (let i = 0; i < availableMakers?.length; i++) {
        renderedMakers.push(
            <Button key={i} title={availableMakers[i].name} clicked={() => updatedMakerIndex(i)} showCount={true} />
        )
    }
    return renderedMakers
}