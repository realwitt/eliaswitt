import {Button} from "./Button.tsx";
import type {Faker} from "./types/Faker";

type FakerProps = {
    availableFakers: Array<Faker>
    toggleFaker(index: number): void
}

export function Fakers({availableFakers, toggleFaker}: FakerProps) {
    if (availableFakers) {
        return (
            <>
            {availableFakers.map((faker, index) => (
                    <Button
                        key={index}
                        title={faker?.fakerName || ""}
                        clicked={() => toggleFaker(index)}
                        countToShow={faker.selected ? 1 : 0}
                    />
                ))}
            </>
        )
    }
}