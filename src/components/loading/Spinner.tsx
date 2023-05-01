import { Spinner as SpinnerFb } from "flowbite-react";

export const Spinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <SpinnerFb
                aria-label="Extra large spinner example"
                size="xl"
            />
        </div>
    );
};
