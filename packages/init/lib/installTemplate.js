import fse from 'fs-extra';
import path from 'node:path';
import { pathExistsSync } from 'path-exists';
import { log } from 'utils';
import ora from 'ora';
import ejs from 'ejs';
import glob from 'glob';

function getCacheFilePath(targetPath, template){
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir){
  // originFile: /Users/liyue/.sharing-6/addTemplate/node_modules/@liyue.com/template-vue3/template
  const originFile = getCacheFilePath(targetPath, template)
  /**
   * [
      'README.md',
      'babel.config.js',
      'jsconfig.json',
      'package.json',
      'public',
      'src',
      'vue.config.js'
    ] fileList
   */
  const fileList = fse.readdirSync(originFile);
  // 将filelist里的文件都拷贝至用户自己指定的项目名称下
  const spinner = ora('正在拷贝模板文件...').start();
  fileList.map(file => {
    // 源文件 - 拷贝 - cli指定的目标路径
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)
  })
  spinner.stop();
  log.success('模板拷贝成功');
}

function ejsRender(installDir, template, name){
  log.verbose('ejsRender', installDir, template);
  const { ignore } = template;
  const ejsData = {
    data: {
      name, //项目名称
    }
  }
  glob('**', {
    cwd: installDir,
    nodir: true,
    // public index.html应由webpack去渲染base_url
    ignore: [
      ...ignore,
      '**/node_modules/**'
    ],
  }, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(installDir, file)
      log.verbose('filePath', filePath);
      ejs.renderFile(filePath, ejsData, (err, result)  => {
       if(!err){
        fse.writeFileSync(filePath, result);
       } else {
        log.error(err)
       }
      })
    })
   
  })
}

export default function installTemplate(selectedTemplate, opts){
  const { force = false } = opts;
  // 获取缓存路径的地址
  const { targetPath, name, template } = selectedTemplate;
  // 当前目录
  const rootDir = process.cwd();
  // 确保缓存路径存在
  fse.ensureDirSync(targetPath);
  // install的目录 当前终端路径
  const installDir = path.resolve(`${rootDir}/${name}`);
  if(pathExistsSync(installDir)){
    // 创建要安装的文件夹
    if(!force){
      log.error(`当前目录下已存在${installDir}文件夹`);
      return;
    } else {
      // 强制安装的时候 创建文件夹
      fse.removeSync(installDir);
      fse.ensureDir(installDir);
    }
  } else {
    fse.ensureDirSync(installDir)
  }
  // 文件夹创建成功后，往里面放模板
  // targetPath: '/Users/liyue/.sharing-6/addTemplate'
  copyFile(targetPath, template, installDir)
  // ejs render
  ejsRender(installDir, template, name)
}