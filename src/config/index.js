import dev from './dev'
import prod from './prod'
import trade from './trade'
import prodPro from './prodPro'
import sp from './sp'

let config = {}
if (process.env.NODE_ENV == 'development') {
    config = {
        trade: trade,
        ...dev
    }
} else {
    config = {
        trade: trade,
        ...prod
    }
}
// config = {
//     trade: trade,
//     ...prodPro
// }
export default config