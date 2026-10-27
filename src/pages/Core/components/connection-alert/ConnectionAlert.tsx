import {ApiOutlined, LoadingOutlined} from '@ant-design/icons';
import {Alert} from 'antd';

import {IndicatorTypeEnum} from '__utils/types';

import {Props} from './types';

const ConnectionAlert = ({type, text}: Props) => {
    const isLoading = type === IndicatorTypeEnum.Loading;

    return (
        <Alert
            type={isLoading ? 'info' : 'error'}
            icon={isLoading ? <LoadingOutlined/> : <ApiOutlined/>}
            title={text}
            showIcon
        />
    );
};

export default ConnectionAlert;
