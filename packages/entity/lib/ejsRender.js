import ejs from 'ejs';
// import prettier from 'prettier/standalone.js';
// import parserBabel from 'prettier/parser-babel.js';
import fse from 'fs-extra';
import { CREATE_LIST_DOCUMENT, CREATE_LIST_BILL } from './preCollect.js'

const FORM_TEMPLATE = `
import {EasyBizFormPresenter} from '@main/components/easy-bizform'; 
import {<%= data.entityName %>} from '@q7/athena-gen'; 
export class <%= data.name %>FormPresenter extends <%= data.createMode %> {
  constructor(options) {super(<%= data.entityName %>, options
    )}}`
const FORM_ITEM_TEMPLATE  = "import {EasyBizFormItemsPresenter} from '@main/components/easy-bizform'; import {<%= data.entityName %>} from '@q7/athena-gen'; export class <%= data.itemName %>FormItemPresenter extends <%= data.itemMode %> {getLogicPath(){return '<%= data.logicPath %>'}}"
const LIST_DOCUMENT_TEMPLATE = "import {DocumentListPagePresenter} from '@root/solutions/athena-solutions/document-list'; import {<%= data.entityName %>} from '@q7/athena-gen'; export class <%= data.name %>ListPresenter extends <%= data.createMode %> {constructor(options) {super({...options})}}"
const LIST_BILL_TEMPLATE = "import {QueryListPagePresenter} from '@main/screens/list'; import {<%= data.entityName %>} from '@q7/athena-gen'; export class <%= data.name %>ListPresenter extends <%= data.createMode %> {constructor(options) {super({...options})}}"

export function ejsRender(argv){
  const { data, renderType, fileName, listMode } = argv;
  let template;
  if(renderType === 'form'){
    template = FORM_TEMPLATE
  }
  if(renderType === 'formItem'){
    template = FORM_ITEM_TEMPLATE
  }
  if(renderType === 'list' && listMode === CREATE_LIST_DOCUMENT){
    template = LIST_DOCUMENT_TEMPLATE
  }
  if(renderType === 'list' && listMode === CREATE_LIST_BILL){
    template = LIST_BILL_TEMPLATE
  }

  fse.writeFileSync(fileName, template);
  ejs.renderFile(fileName, data, (err, result)  => {
    if(!err){

      // const formatText = prettier.format(result, {
      //   parser: "babel",
      //   plugins: [parserBabel]
      // });
      // fse.writeFileSync(fileName, formatText);
      fse.writeFileSync(fileName, result);
    } else {
      log.error(err)
    }
  })
}