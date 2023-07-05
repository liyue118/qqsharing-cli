import { log } from "utils";
import fse from 'fs-extra';
import { 
  getCacheDir,
  CREATE_MODE_FORM,
  CREATE_MODE_FORM_AND_LIST,
  CREATE_MODE_LIST,
  CREATE_LIST_BILL
} from "./preCollect.js";
import { pathExistsSync } from 'path-exists';
import { ejsRender } from "./ejsRender.js";

export function makeCacheDir(argv){
  const { mkdirName, entityName, opts, createMode, createFormItem, createListMode } = argv;
  const targetPath = process.cwd();
  const cacheDir = getCacheDir(targetPath, mkdirName);
  const currentEntity = mkdirName.charAt(0).toUpperCase() + mkdirName.slice(1);
  log.verbose(targetPath, mkdirName, entityName,  opts, createMode, createFormItem, createListMode, 'targetPath, mkdirName, entityName,  opts, createMode, createFormItem, createListMode')
  if(!pathExistsSync(cacheDir)){
    // 这个目录下任何一个路径不存在，都会创建这个目录
    // 1. 创建实体文件夹
    fse.mkdirpSync(cacheDir)
    // 根绝选择的类型创建表单和或列表文件夹
    // 2.创建form文件夹
    if(createMode === CREATE_MODE_FORM || createMode === CREATE_MODE_FORM_AND_LIST){
      const cacheEntityFormDir = getCacheDir(`${targetPath}/${mkdirName}`, 'form');
      if(!pathExistsSync(cacheEntityFormDir)){
        fse.mkdirpSync(cacheEntityFormDir)
      }
      const formDir = `${targetPath}/${mkdirName}/form`
      const cacheEntityFormDirPresenter = getCacheDir(formDir, `${currentEntity}FormPresenter.tsx`);
      if(!pathExistsSync(cacheEntityFormDirPresenter)){
        fse.createFileSync(cacheEntityFormDirPresenter)
      }
      const ejsFormData = {
        data: {
          name: currentEntity,
          entityName,
          createMode: 'EasyBizFormPresenter'
        }
      }
      ejsRender({
        data: ejsFormData, 
        renderType: 'form', 
        fileName: cacheEntityFormDirPresenter
      })
      // 2.1 看是否同时需要创建子表文件
      if(!!createFormItem){
        const needCreateFormItem = createFormItem.split(',');
        needCreateFormItem.forEach(item => {
          const cacheEntityFormItemDirPresenter = getCacheDir(formDir, `${currentEntity}FormItemPresenter.tsx`);
          if(!pathExistsSync(cacheEntityFormItemDirPresenter)){
            fse.createFileSync(cacheEntityFormItemDirPresenter)
          }
          const ejsFormItemData = {
            data: {
              itemName: currentEntity,
              entityName,
              logicPath:item,
              itemMode: 'EasyBizFormItemsPresenter'
            }
          }
          ejsRender({
            data: ejsFormItemData, 
            renderType: 'formItem', 
            fileName: cacheEntityFormItemDirPresenter
          })
        });
      }
    }
    // 3.创建list文件夹
    if((createMode === CREATE_MODE_LIST || createMode === CREATE_MODE_FORM_AND_LIST) && createListMode){
      const cacheEntityListDir = getCacheDir(`${targetPath}/${mkdirName}`, 'list');
      if(!pathExistsSync(cacheEntityListDir)){
        fse.mkdirpSync(cacheEntityListDir)
      }
      const listDir = `${targetPath}/${mkdirName}/list`
      const cacheEntityListDirPresenter = getCacheDir(listDir, `${currentEntity}ListPresenter.tsx`);
      if(!pathExistsSync(cacheEntityListDirPresenter)){
        fse.createFileSync(cacheEntityListDirPresenter)
      }
      // 3.1 根据子表mode写入不同模板
      const ejsListData = {
        data: {
          name: currentEntity,
          entityName,
          createMode: createListMode === CREATE_LIST_BILL ? 'QueryListPagePresenter' : 'DocumentListPagePresenter'
        }
      }
      ejsRender({
        data: ejsListData, 
        renderType: 'list', 
        fileName: cacheEntityListDirPresenter, 
        listMode: createListMode
      })
    }

  }
}