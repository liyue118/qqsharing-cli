import path from 'node:path';
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra';
import ora from 'ora';
import { execa } from 'execa';
import { printErrorLog, log } from 'utils';

function getCacheDir(targetPath){
  // 如果node_modules 不存在，会创建一个
  return path.resolve(targetPath, 'node_modules');
}
// 创建
function makeCacheDir(targetPath){
  const cacheDir = getCacheDir(targetPath);
  if(!pathExistsSync(cacheDir)){
    // 这个目录下任何一个路径不存在，都会创建这个目录
    fse.mkdirpSync(cacheDir)
  }
}

async function downloadAddTemplate(targetPath, selectedTemplate){
  const { npmName, version } = selectedTemplate;
  const installCommand = 'npm';
  const installArgs = ['install', `${npmName}@${version}`];
  const cwd = targetPath;
  log.verbose('installArgs', installArgs)
  log.verbose('cwd', targetPath)
  await execa(installCommand, installArgs, { cwd })
}

export default async function downloadTemplate(selectTemplate) {
  const { targetPath, template } = selectTemplate;
  // 创建缓存主目录
  makeCacheDir(targetPath)
  const spinner = ora('正在下载模板...').start();
  try{
    await downloadAddTemplate(targetPath, template)
    spinner.stop();
    log.success('下载模板成功')
  } catch(e){
    printErrorLog(e);
  }
}