interface OwnProps {
    // obs_output_get_congestion: 0 = everything is sent at once, 1 = the send buffer is full
    value: number;
}

export type Props = OwnProps;
