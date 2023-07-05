'use strict'

import Command from "command";
import createTemplate from './createTemplate.js';
import { log } from 'utils';
import downloadTemplate from './downloadTemplate.js';
import installTemplate from './installTemplate.js';


/**
 * 命令注册的过程
 * 1、 创建一个class继承command
 */

/**
 * examples: 
 * 方式1： sharing6-cli init 111 -t project -tp template-vue3 --force
 * 方式2： sharing6-cli init
 */
class InitCommand extends Command  {
  get command(){
    // 注册命令
    return 'init [name]'
  }

  get description(){
    return 'init project'
  }
  
  get options(){
    return [
      // 第三个参数是默认值
      ['-f, --force', '是否强制更新', false],
      ['-t, --type <type>', '项目类型(值：project/page)'],
      ['-tp, --template <template>', '模板名称'],
    ]
  }

  async action([name, opts]){
    log.verbose('init', name, opts)

    // 1. 选择项目模板，生成项目信息
    const selectTemplate = await createTemplate(name, opts)
    log.verbose('selectTemplate', selectTemplate)
    // 2. 下载项目模板至缓存目录
    await downloadTemplate(selectTemplate)
    // // 3. 安装项目模板至项目目录
    await installTemplate(selectTemplate, opts);
  }

  preAction(){
    // console.log('pre')
  }
  postAction(){
    // console.log('post')
  }
}

function Init(instance){  
  return new InitCommand(instance)
}

export default Init;