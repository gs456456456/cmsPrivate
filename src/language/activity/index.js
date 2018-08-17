import htb from './htb_bonus'
import activitymix from './activity_mix'
import icon from './icon'
import eubc from './eubc';

export default {
    "zh-CN": {
        ...htb['zh-CN'],
        ...activitymix['zh-CN'],
        ...icon['zh-CN'],
        ...eubc['zh-CN'],
    },
    "en-US": {
        ...htb['en-US'],
        ...activitymix['en-US'],
        ...icon['en-US'],
        ...eubc['en-US'],
    },
}