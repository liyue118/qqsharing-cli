import log from 'npmlog';
import isDebug from './isDebug.js';

if(isDebug()){
  // 指定verbose会输出调试信息
  log.level = 'verbose';
} else {
  log.level = 'info';
}

log.heading = 'liyue'

// 2000？ 
log.addLevel('success', 2000, { fg: 'green', bold: true });

export default log;