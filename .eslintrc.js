/*
 * @Description  : 
 * @Author       : Roson
 * @Date         : 2022-04-03 16:34:04
 * @LastEditors  : Roson
 * @LastEditTime : 2022-04-03 16:50:48
 */
const path = require("path")

module.exports =(() => {
console.log('main lint', path.resolve('./roson-lint'));
return {
 extends: [path.resolve('../roson-lint')]
}
})();