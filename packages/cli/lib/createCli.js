import path from 'node:path';
import { program } from 'commander';
import { log } from 'utils';
// esm不支持 import package json
// import pkg from '../package.json';
import { dirname } from 'dirname-filename-esm';
// 读取json文件
import fse from 'fs-extra';

const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = fse.readJSONSync(pkgPath);

export default function createCli() {
    // 脚手架入口文件
  // 拿到program的实例开始注册脚手架
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)

  // 监听属性
  program.on('option:debug', function(){
    // 对应 program的options 在action的时候可以拿到具体的信息
    console.log(program.opts())
    if(program.opts().debug){
      log.verbose('debug', 'launch debug mode')
    }
  })
  
  // 处理不存在的命令
  program.on('command:*', function(obj){
    log.error('未知的命令：' +obj[0])
  })

  return program;
}