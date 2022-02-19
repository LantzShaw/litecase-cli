#!/usr/bin/env node
// 添加了这句话后，package.jsonr的bin里就不要写node了

// Commander是一个轻量级，富有表现力，以及用于强大的命令行框架的node.js

// 指定从PATH环境变量中来查找node解释器的位置，因此只要环境变量中存在，该脚本即可执行

const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')

const pkg = require('../package.json')
const CliUtil = require('../lib/util.js')

const util = new CliUtil(program)

if (process.argv.slice(2).join('') === '-v') {
  console.log(`litecase-cli: ${pkg.version}`)
  return
}

program
  .version(pkg.version)
  .usage('<command> [options] <app-name>')
  .option('-c, --clone', 'use git clone')
  .on('--help', () => {
    console.log()
    console.log('Examples:')
    console.log()
    console.log(chalk.gray('  # create a new react project'))
    console.log('  $ litecase create demo')
    console.log()
    console.log('This text is for tesing!')
  })

program
  .command('setup')
  .description('run remote setup commands')
  .action(function () {
    console.log('setup')
  })

program
  .command('create')
  .description('generate a new project from a template')
  .action(() => {
    util.initializing(pkg)

    const appName = program.args[1]

    if (typeof appName !== 'string') {
      const nameOptions = [
        {
          type: 'input',
          name: 'name',
          message: 'Please enter the app name for your project：',
          validate: name => {
            if (!name) {
              return '⚠️  app name must not be null！'
            }
            return true
          },
        },
      ]

      inquirer.prompt(nameOptions).then(({ name }) => {
        if (name) {
          generateOptions(name)
        }
      })
    } else {
      generateOptions(appName)
    }
  })

/**
 * error on unknown commands
 */
program.on('command:*', function () {
  console.error('Invalid command: %s\n', program.args.join(' '))

  program.help()

  process.exit(1)
})

const help = () => {
  program.parse(process.argv) // 解析

  if (program.args.length < 1) return program.help()
}

/**
 * 构建选项
 * @param {String} appName
 */
const generateOptions = appName => {
  const templateOptions = [
    {
      type: 'list',
      message: 'Choose your template:',
      name: 'template',
      choices: ['react', 'vue', 'weapp'],
    },
  ]

  inquirer.prompt(templateOptions).then(({ template }) => {
    if (template !== 'weapp') {
      const languageOptions = [
        {
          type: 'list',
          message: 'Choose language you want to use:',
          name: 'language',
          choices: ['JavaScript', 'TypeScript'],
        },
      ]

      inquirer.prompt(languageOptions).then(({ language }) => {
        util.checkAppName(appName, template, language)
      })
    } else {
      util.checkAppName(appName, template, '')
    }
  })
}

help()
