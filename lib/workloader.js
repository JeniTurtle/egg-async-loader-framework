const egg = require('egg');
const { EventEmitter } = require('events');
const BOOTS = Symbol('Lifecycle#boots');
const CONTINUE_EVENT_NAME = Symbol('egg-loader#continue');

class AppWorkerLoader extends egg.AppWorkerLoader {
  /**
   * loadPlugin first, then loadConfig
   * @since 1.0.0
   */
  loadConfig() {
    this.loadPlugin();
    super.loadConfig();
  }

  /**
   * Load all directories in convention
   * @since 1.0.0
   */
  async load() {
    // app > plugin > core
    this.loadApplicationExtend();
    this.loadRequestExtend();
    this.loadResponseExtend();
    this.loadContextExtend();
    this.loadHelperExtend();
    this.loadCustomLoader();

    const emitter = new EventEmitter();
    const lifecycle = this.lifecycle;

    const executeSymbolFunc = async (obj, fnName) => {
      const properties = Object.getOwnPropertySymbols(obj);
      for (const index of properties) {
        if (index.toString() === BOOTS.toString()) {
          for (const boot of obj[index]) {
            if (boot[fnName]) {
              await boot[fnName]()
            }
          }
        }
      }
    }

    lifecycle.triggerConfigWillLoad = async () => {
      await executeSymbolFunc(lifecycle, 'configWillLoad');
      lifecycle.triggerConfigDidLoad();
      emitter.emit(CONTINUE_EVENT_NAME);
    }

    // lifecycle.triggerConfigDidLoad = async () => {
    //   await executeSymbolFunc(lifecycle, 'configDidLoad');
    //   lifecycle.triggerDidLoad();
    //   emitter.emit(CONTINUE_EVENT_NAME);
    // }

    this.loadCustomApp();

    emitter.on(CONTINUE_EVENT_NAME, () => {
      // app > plugin
      this.loadService();
      // app > plugin > core
      this.loadMiddleware();
      // app
      this.loadController();
      // app
      this.loadRouter(); // Dependent on controllers
    })
  }
}

module.exports = AppWorkerLoader;