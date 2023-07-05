import inquirer from 'inquirer';

function make({
  choices,
  defaultValue,
  message = '请选择',
  type = 'list',
  require = true,
  mask = '*',
  validate, 
  pageSize, 
  loop,
}){
  const options = {
    // 输出的变量名称
    name: 'name',
    default: defaultValue,
    choices,
    message,
    type,
    require,
    mask,
    validate, 
    pageSize, 
    loop,
  }

  if(type === 'list'){
    options.choices = choices
  }
  return inquirer.prompt(options).then(answer => answer.name)
}

export function makeList(params){
  return make({ ...params });
}

export function makeInput(params){
  return make({
    type: 'input',
    ...params
  })
}

export function makePassword(params){
  return make({
    type: 'password',
    ...params
  })
}