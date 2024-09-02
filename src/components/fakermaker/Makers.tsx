import type {AvailableSchemaOptions} from "./types/AvailableSchemaOptions";
import {Button} from "./Button.tsx";
import {useState} from "react";

type FakerProps = {
    availableSchemaOptions: AvailableSchemaOptions
}


export function Makers({availableSchemaOptions} : FakerProps) {
    const makers = []
    for (let i = 0; i < availableSchemaOptions.makers.length; i++) {
        makers.push(
            <Button title={availableSchemaOptions.makers[i].name} clicked={() => console.log('clicked')} showCount={true} />
        )
    }
    return makers
}