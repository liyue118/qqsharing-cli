import fs from 'node:fs';
import { log, makeInput, makeList } from "utils";
import path from 'node:path';
import fse from 'fs-extra';
import { pathExistsSync } from 'path-exists';

export function getCacheDir(targetPath, name){
  // 如果name 不存在，会创建一个
  return path.resolve(targetPath, name);
}


export function isValidEntityName(name, opts){
  const frontTheoryPath = process.cwd().split('/front-theory');
  const genEntityNames = fs.readFileSync(`${frontTheoryPath[0]}/front-theory/packages/athena-gen/lib/entity-names.d.ts`).toString();
  const currentEntity = name.charAt(0).toUpperCase() + name.slice(1);
  const regex = RegExp(`EN_${currentEntity} = "${currentEntity}"`, 'g');
  const matchGenEntity = regex.exec(genEntityNames)
  if(!matchGenEntity){
    log.error(`实体不存在或gen未定义，请检查`);
    return false;
  }
  log.verbose('init', name, opts)
  const cacheDir = getCacheDir(process.cwd(), name);
  if(opts.force){
    fse.removeSync(cacheDir);
  }
  if(pathExistsSync(cacheDir)){
    log.error(`当前目录下已存在${cacheDir}文件夹,如果要覆盖请使用 --force 或 -f`);
    return;
  }
  return matchGenEntity[0].split(' ');
}

export const CREATE_MODE_FORM_AND_LIST = 'create-form-and-list';
export const CREATE_MODE_FORM = 'create-form';
export const CREATE_MODE_LIST = 'create-list';
export const CREATE_LIST_DOCUMENT = 'create-document-list';
export const CREATE_LIST_BILL = 'create-bill-list';

const CREATE_MODE = [
  {
    name: '表单和列表', 
    value: CREATE_MODE_FORM_AND_LIST
  },
  {
    name: '表单', 
    value: CREATE_MODE_FORM
  },
  {
    name: '列表', 
    value: CREATE_MODE_LIST
  }
]

const CREATE_LIST = [
  {
    name: '档案', 
    value: CREATE_LIST_DOCUMENT
  },
  {
    name: '单据', 
    value: CREATE_LIST_BILL
  }
]

export function getCreateMode(){
  return makeList({
    message:'请选择创建的模式',
    choices: CREATE_MODE
  })
}

export async function getFormItemMode(){
  return makeInput({
    message:'请输入表单的子表，如果没有可以不输入,如果有多个以英文,间隔',
  })
}

export async function getListMode(createMode){
  if(createMode === CREATE_MODE_LIST || createMode === CREATE_MODE_FORM_AND_LIST){
    return makeList({
      message:'请选择要创建的列表模式',
      choices: CREATE_LIST
    })
  }
  return undefined;
}

export async function getFormItem(createMode){
  if(createMode === CREATE_MODE_FORM || createMode === CREATE_MODE_FORM_AND_LIST){
    return await getFormItemMode()
  }
  return undefined;
}