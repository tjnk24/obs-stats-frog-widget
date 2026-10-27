import preload from '__utils/hocs/preload';

import CorePage from './CorePage';
import {onDispose, onLoad} from './preload';

export default preload({onLoad, onDispose})(CorePage);
