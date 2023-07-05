import createCli from './createCli.js';
import createInitCommand  from 'init';
import createEntityMkdir from 'entity';

export default function(args){
  const program = createCli()
  // 注册自定义命令 默认写法
  // program
  // .command('init [name]')
  // .description('init project')
  // .option('-f, --force', '是否强制更新', false)
  // .action((name, opts) => {
  //   console.log('init.....', name, opts)
  // })
  createInitCommand(program)
  createEntityMkdir(program)
  program.parse(process.argv)
}

