'use strict'

import Command from 'command';
import { isValidEntityName, getCreateMode, getFormItem, getListMode } from './preCollect.js';
import { makeCacheDir } from './makeCacheDir.js';

class CreateEntityMkdirCommand extends Command {
  get command(){
    // 注册命令
    return 'createEntityMkdir [name]'
  }

  get description(){
    return 'createEntityMkdir mkdir'
  }
  
  get options(){
    return [
      // 第三个参数是默认值
      ['-f, --force', '是否强制覆盖', false],
    ]
  }

  async action([name, opts]){
    // 1. 判断实体是否存在 = name是否合法
    // 实体名称转化Gen，读项目的packages/athena-gen/lib/entity-name.d.ts
    const entityName = isValidEntityName(name, opts)
    if(!entityName){
      return;
    }
    // 2. 根据实体分别创建列表和表单
    this.createMode = await getCreateMode();
    // 3. 如果是表单形式，需要再输入具体的子表名称，并创建
    this.createFormItem = await getFormItem(this.createMode)
    // 4. 如果是列表形式，需要指定是档案列表还是单据列表
    this.createListMode = await getListMode(this.createMode) 
    // 5. 创建表单列表目录
    makeCacheDir({
      mkdirName:name, 
      entityName:entityName[0], 
      opts, 
      createMode:this.createMode, 
      createFormItem:this.createFormItem, 
      createListMode:this.createListMode
    });
  }
}

function createEntityMkdir(instance){
  return new CreateEntityMkdirCommand(instance)
}

export default createEntityMkdir;