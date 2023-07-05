import { homedir } from 'node:os';
import { log, makeList, makeInput } from 'utils';
import path from 'node:path';

const ADD_TEMPLATE = [
  {
    name: 'vue3项目模板',
    value: 'template-vue3',
    npmName: '@liyue.com/template-vue3',
    version: '1.0.2',
    team: '移动端',
    "ignore": [
      "**/public/**"
    ]
  },
  {
    name: 'react项目模板',
    value: 'template-react18',
    npmName: '@liyue.com/template-react18',
    version: '1.0.1',
    team: 'PC端',
    "ignore": [
      "**/public/**"
    ]
  },
  {
    name: 'vue-element-admin项目模板',
    value: 'template-vue-element-admin',
    npmName: '@liyue.com/template-vue-element-admin',
    version: '1.0.0',
    team: 'PC端',
    "ignore": [
      "**/public/**"
    ]
  }
]
const ADD_TYPE_PAGE = 'page';
const ADD_TYPE_PROJECT = 'project';
const ADD_TYPE = [
  {
    name: '项目',
    value: ADD_TYPE_PROJECT
  },
  {
    name: '页面',
    value: ADD_TYPE_PAGE
  }
]
const TEMP_HOME = '.sharing-6';

// 获取创建类型
function getAddType(){
  return makeList({
    choices: ADD_TYPE,
    message: '请选择初始化类型',
    defaultValue: ADD_TYPE_PROJECT,
  })
}

// 获取项目名称
function getAddName(){
  return makeInput({
    message: '请输入项目名称',
    defaultValue: '',
    validate(v){
      if(v.length > 0){
        return true
      }
      return '项目名称必须输入'
    }
  })
}

// 选择项目模板
function getAddTemplate(ADD_TEMPLATE){
  return makeList({
    choices: ADD_TEMPLATE,
    message: '请选择项目模板',
  })
}

// 选择所在团队
function getAddTeam(team){
  return makeList({
    choices: team.map(item => ({ name: item, value: item })),
    message: '请选择团队',
  })
}

// 安装缓存目录
function makeTargetPath(){
  console.log(homedir())
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate')
}

export default async function createTemplate(name, opts){
  if(!ADD_TEMPLATE){
    throw new Error('项目模板不存在！')
  }
  let addType; // 创建的项目类型
  let addName; // 创建的项目名称
  let selectedTemplate; // 选择的出项目模板
  const { type = null, template = null } = opts;
  if(type){
    // 用户直接通过命令行输入的
    addType = type;
  } else {
    // 用户手动选择的 获取创建的类型 项目或页面
    addType = await getAddType()
  }
  log.verbose('addType', addType)

  if(addType === ADD_TYPE_PROJECT){
    if(name){
      addName = name;
    } else {
      addName = await getAddName();
    }
    log.verbose('addName', addName)

    if(template){
      selectedTemplate = ADD_TEMPLATE.find(tp => tp.value === template)
    } else {
      // 获取团队信息
      let teamList = ADD_TEMPLATE.map(_ => _.team);
      teamList = [ ...new Set(teamList)];
      const addTeam = await getAddTeam(teamList);
      log.verbose('addTeam', addTeam)
      const addTemplate = await getAddTemplate(ADD_TEMPLATE.filter(_ => _.team === addTeam));
      selectedTemplate = ADD_TEMPLATE.find(_ => _.value === addTemplate)
      log.verbose('addTemplate', addTemplate)
    }

    if(!selectedTemplate){
      throw new Error(`项目模板 ${template} 不存在`)
    }

    const targetPath = makeTargetPath();
    return {
      type: addType,
      name: addName,
      template: selectedTemplate,
      // 安装目录
      targetPath
    }
  } else {
    throw new Error(`创建的项目类型 ${addType} 不支持`)
  }
}