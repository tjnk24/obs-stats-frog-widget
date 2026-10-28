import {
    Alert,
    Form,
    InputNumber,
} from 'antd';

import {getObsWebSocketPort} from '__utils/getObsWebSocketPort';

import {PORT_RULES} from './consts';
import {Props} from './types';

import style from './style.module.scss';

const PortField = ({extra}: Props) => {
    const portDevOverride = getObsWebSocketPort();

    return (
        <>
            <Form.Item
                name="port"
                label="Порт obs-websocket"
                extra={extra}
                rules={PORT_RULES}
                required
            >
                <InputNumber
                    type="number"
                    className={style.input}
                    precision={0}
                />
            </Form.Item>

            {portDevOverride !== null && (
                <Alert
                    className={style.alert}
                    type="info"
                    title={`Сейчас порт ${portDevOverride} задан в адресе панели (?port=) и важнее этой настройки.`}
                    showIcon
                />
            )}
        </>
    );
};

export default PortField;
