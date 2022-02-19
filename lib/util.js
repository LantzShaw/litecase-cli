const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const ora = require('ora')
const rm = require('rimraf').sync
const updateNotifier = require('update-notifier')
const boxen = require('boxen')
const download = require('download-git-repo')

const GIT_BASE = 'https://github.com/'
const REACT_TEMPLATE = 'LantzShaw/react-template'
const REACT_TYPESCRIPT_TEMPLATE = 'LantzShaw/react-typescript-template'
const VUE_TEMPLATE = 'LantzShaw/vue-template'
const VUE_TYPESCRIPT_TEMPLATE = 'LantzShaw/vue-typescript-template'
const WEAPP_TEMPLATE = 'LantzShaw/weapp-template'

const BOXEN_OPTS = {
  padding: 1,
  margin: 1,
  align: 'center',
  borderColor: '#7ed321',
  borderStyle: 'round',
}

class CliUtil {
  constructor(program, opts) {
    this.program = program
    this.opts = opts
    this.templateName = REACT_TEMPLATE
  }

  initializing(pkg) {
    const messages = []

    messages.push(`🔥  Welcome to use litecase-cli ${chalk.grey(`v${pkg.version}`)}`)
    messages.push(chalk.grey('https://github.com/LantzShaw/litecase-cli'))
    messages.push(chalk.grey('https://www.npmjs.com/package/litecase-cli'))

    console.log(boxen(messages.join('\n'), BOXEN_OPTS))

    this.checkVersion(pkg)
  }

  checkVersion(pkg) {
    console.log()
    console.log('🛠️  Checking your litecase-cli version...')

    let checkResult = false

    const notifier = updateNotifier({
      pkg,
      updateCheckInterval: 0,
    })

    const update = notifier.update

    if (update) {
      const messages = []

      messages.push(
        `Update available ${chalk.grey(update.current)} → ${chalk.green(update.latest)}`
      )

      messages.push(`Run ${chalk.cyan(`npm i -g ${pkg.name}`)} to update`)

      console.log(boxen(messages.join('\n'), { ...BOXEN_OPTS, borderColor: '#fae191' }))
      console.log('🛠️  Finish checking your litecase-cli. CAUTION ↑↑', '⚠️')
    } else {
      checkResult = true

      console.log('🛠️  Finish checking your litecase-cli. OK', chalk.green('✔'))
    }

    return checkResult
  }

  checkAppName(appName, template, language) {
    const to = path.resolve(appName) // 获取绝对路径

    console.log(appName, template, language)

    switch (template) {
      case 'react':
        if (language === 'TypeScript') {
          this.templateName = REACT_TYPESCRIPT_TEMPLATE
        } else {
          this.templateName = REACT_TEMPLATE
        }
        break
      case 'vue':
        if (language === 'TypeScript') {
          this.templateName = VUE_TYPESCRIPT_TEMPLATE
        } else {
          this.templateName = VUE_TEMPLATE
        }
        break
      case 'weapp':
        this.templateName = WEAPP_TEMPLATE
        break
      default:
        break
    }

    if (appName === '.') {
      this.checkEmpty(to)
    } else if (this.checkExist(to)) {
      inquirer
        .prompt([
          {
            type: 'confirm',
            message: 'Target directory exists. Continue?',
            name: 'ok',
          },
        ])
        .then(answers => {
          if (answers.ok) {
            rm(appName)

            this.downloadAndGenerate(this.templateName, to, appName)
          }
        })
    } else {
      this.downloadAndGenerate(this.templateName, to, appName)
    }
  }

  checkExist(path) {
    return fs.pathExistsSync(path)
  }

  checkEmpty(path, appName) {
    const dirFiles = fs.readdirSync(path)

    if (dirFiles.length > 0) {
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'ok',
            message: 'Target directory is not empty and will overwritten. Continue?',
          },
        ])
        .then(answers => {
          if (answers.ok) {
            fs.emptyDirSync(path)

            this.downloadAndGenerate(this.templateName, path, appName)
          }
        })
    } else {
      this.downloadAndGenerate(this.templateName, path, appName)
    }
  }

  downloadAndGenerate(template, to, appName) {
    const spinner = ora(`Downloading the template from ${GIT_BASE}${template}`)

    spinner.start()
    // Remove if local template exists
    // if (!appName) fs.emptyDirSync(to);
    // else if (this.checkExist(to) && appName) rm(appName);
    this.download(template, to)
      .then(() => {
        spinner.stop()
        console.log('🎉 Finish create a new react project. OK', chalk.green('✔'))
        console.log()
        console.log(
          `To get started:\n\n  ${
            appName ? `cd ${appName}\n  ` : ''
          }npm install\n  npm start\n\nDocumentation can be found at:`,
          chalk.green(`${GIT_BASE}${template}`)
        )
        console.log()
      })
      .catch(err => {
        spinner.stop()
        console.log()
        console.error(chalk.red('Failed to download repo ' + template + ': ' + err.message.trim()))
        process.exit(1)
      })
  }

  download(template, to) {
    return new Promise((resolve, reject) => {
      const clone = this.program.clone || false

      download(template, to, { clone }, err => (err ? reject(err) : resolve()))
    })
  }
}

module.exports = CliUtil
