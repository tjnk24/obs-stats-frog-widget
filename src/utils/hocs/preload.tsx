import {ComponentType, useLayoutEffect} from 'react';

import {PreloadDto} from '__types/PreloadDto';

// onLoad on mount, onDispose on unmount, not re-run on path changes:
// it wraps the app shell, and the connection must outlive page changes
export default function preload<P extends object>({onLoad, onDispose}: PreloadDto) {
    return (Component: ComponentType<P>) => {
        const Preloaded = (props: P) => {
            useLayoutEffect(() => {
                onLoad?.();

                return () => onDispose?.();
            }, []);

            return <Component {...props}/>;
        };

        return Preloaded;
    };
}
