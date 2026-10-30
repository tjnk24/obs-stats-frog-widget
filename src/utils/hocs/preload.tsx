import {ComponentType, useLayoutEffect} from 'react';

import {PreloadDto} from '__types/app/PreloadDto';

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
