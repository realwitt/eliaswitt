type SessionProps = {
    uuid: string
    uuidUpdate(uuidString: string): void
}

export function Session({uuid, uuidUpdate}: SessionProps) {

    function renderUuid() {
        // make fetch call to check if uuid exists
        // set delay to like 1.5 seconds so it's backend isn't hammered every keystroke
        if (uuid) {
            return (
                <div className="flex mt-4">
                    <div className="text-sm text-light_blue -mb-0.5 mt-1 ">
                        Current schema now tied to UUID:
                    </div>
                    <div className="flex-1 max-w-[64px]"/>
                    {/*todo: add spinny icon for when you're typing while the fetch request is being returned*/}
                    <div
                        className={`bg-transparent text-accent_pink border-transparent border-b-subtle_blue focus:border-b-accent_pink border-2 focus:outline-none focus:ring-0 text-sm placeholder:text-subtle_blue`}>
                        {uuid}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col max-w-[1300px] px-5 md:px-10 mx-auto mb-5">
            <div className="flex">
                <label className="text-sm text-light_blue -mb-0.5 mt-1 " htmlFor="nickName">
                    Restore previous session using UUID:
                </label>
                <div className="flex-1 max-w-[50px]"/>
                <input
                    className={`bg-transparent text-accent_pink border-transparent border-b-subtle_blue focus:border-b-accent_pink border-2 focus:outline-none focus:ring-0 text-sm placeholder:text-subtle_blue`}
                    name="nickname"
                    id="nickName"
                    placeholder="i.e. 1234567890123"
                    defaultValue={uuid ? uuid : ''}
                    size={20}
                    maxLength={20}
                    onChange={(e) => {
                        uuidUpdate(e.target.value);
                    }}
                />
            </div>
            {renderUuid()}
        </div>
    )
}