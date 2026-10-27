import {
    MouseEvent,
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

// the button spins while the promise its handler returns is pending, and ignores clicks meanwhile
export const useAsyncButtonClick = (onClick: MouseEventHandler<HTMLElement> | undefined) => {
    const isMountedRef = useRef(false);
    const isPendingRef = useRef(false);

    const [isPending, setIsPending] = useState(false);

    const handleClick = useCallback(
        async (event: MouseEvent<HTMLElement>) => {
            if (!onClick) {
                return;
            }

            if (isPendingRef.current) {
                event.preventDefault();

                return;
            }

            isPendingRef.current = true;

            try {
                await new Promise(resolve => {
                    setIsPending(true);

                    return resolve(onClick(event));
                });
            } finally {
                isPendingRef.current = false;
                isMountedRef.current && setIsPending(false);
            }
        },
        [onClick],
    );

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return {isPending, handleClick};
};
