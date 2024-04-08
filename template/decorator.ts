import "reflect-metadata";

export class Injector {
  private readonly providerMap: Map<any, any> = new Map();
  private readonly instanceMap: Map<any, any> = new Map();
  private readonly paramsMap: WeakMap<any, any> = new WeakMap();

  public setProvider(key: any, value: any) {
    if (!this.providerMap.has(key)) {
      this.providerMap.set(key, value);
    }
  }

  public getProvider(key: any) {
    return this.providerMap.get(key);
  }

  public setInstance(key: any, value: any) {
    if (!this.instanceMap.has(key)) {
      this.instanceMap.set(key, value);
    }
  }

  public getInstance(key: any) {
    if (this.instanceMap.has(key)) {
      return this.instanceMap.get(key);
    }
    return null;
  }

  public getParams(key: any) {
    if (this.paramsMap.has(key)) {
      return this.paramsMap.get(key);
    }
    return {};
  }
  public setParams(key: any, value: any) {
    this.paramsMap.set(key, value);
  }
}

export const rootInject = new Injector();

// 将类注入到工厂中 类装饰器返回一个值，它会使用提供的构造函数来替换原来类的声明
export function Injectable(): (_constructor: any) => any {
  return (_constructor: any) => {
    rootInject.setProvider(_constructor, _constructor);
    return _constructor;
  };
}

// 将依赖注入到生产者
export function Inject(): (_constructor: any, peopertyName: string) => any {
  return (_constructor: any, propertyName: string) => {
    /*
     ** 获取属性定义时的类型
     ** 使用 Reflect 的元数据 Reflect.getMetadata('design:type') 获取属性的类型，并作为唯一标识去
     ** injector.getInstance 查询对应的实例，如果有则直接将属性映射为查找到的实例。这样就保证我们每次使用
     ** 装饰器的属性都会获得单例。
     */
    const propertyType = Reflect.getMetadata(
      "design:type",
      _constructor,
      propertyName
    );

    const injector: Injector = rootInject;
    let provideInstance = injector.getInstance(propertyType);

    if (!provideInstance) {
      const providerClass = injector.getProvider(propertyType);
      provideInstance = new providerClass();
      injector.setInstance(propertyType, provideInstance);
    }
    _constructor[propertyName] = provideInstance;
  };
}

// 类装饰器
export function BaseUrl(url: string) {
  return function (_constructor: any): any {
    _constructor.prototype.baseUrl = url;
  };
}

function collectFnParams(constructor: any, name: string, _arguments: any) {
  const requestParams: { [propName: string | number]: any } = {};
  const params = constructor.params[name].params;
  const body = constructor.params[name].body;
  const url = constructor.params[name].url;

  if (_arguments[params]) {
    requestParams.params = _arguments[params];
  }

  if (_arguments[body]) {
    requestParams.data = _arguments[body];
  }
  if (_arguments[url]) {
    requestParams.path = _arguments[url];
  }
  let p1 = Reflect.getMetadata(name + ":" + "params", constructor);
  return requestParams;
}
function collectFnParamsForMetdata(
  constructor: any,
  name: string,
  _arguments: any
) {
  const requestParams: { [propName: string | number]: any } = {};
  const paramsIndex = Reflect.getMetadata(`${name}:params`, constructor);
  const urlIndex = Reflect.getMetadata(`${name}:url`, constructor);
  const bodyIndex = Reflect.getMetadata(`${name}:body`, constructor);

  if (_arguments[paramsIndex]) {
    requestParams.params = _arguments[paramsIndex];
  }

  if (_arguments[bodyIndex]) {
    requestParams.data = _arguments[bodyIndex];
  }
  if (_arguments[urlIndex]) {
    requestParams.path = _arguments[urlIndex];
  }

  return requestParams;
}

// 装饰器工厂
class DecoratorGenerator {
  // 方法装饰器生成器
  static createMethodsDecorator(methods: "get" | "post" | "put" | "delete") {
    return function (path: string) {
      return function (_constructor: any, name: string, describe: any) {
        describe.value = function () {
          const requestParams = collectFnParamsForMetdata(
            _constructor,
            name,
            arguments
          );

          path = requestParams.path ? `${path}/${requestParams.path}` : path;
          return _constructor[methods].call(new _constructor.constructor(), {
            ...requestParams,
            url: path
          });
        };
      };
    };
  }

  // 方法参数装饰器生成器
  static createParamsDecorator(type: "params" | "body" | "url") {
    return function (_constructor: any, name: string, index: number) {
      Reflect.defineMetadata(name + ":" + type, index, _constructor);
    };
  }
}

// 使用生成器生成请求装饰器
export const Get = DecoratorGenerator.createMethodsDecorator("get");
export const Post = DecoratorGenerator.createMethodsDecorator("post");
export const Put = DecoratorGenerator.createMethodsDecorator("put");
export const Delete = DecoratorGenerator.createMethodsDecorator("delete");

// 使用生成器生成参数装饰器
export const Query = DecoratorGenerator.createParamsDecorator("params");
export const Body = DecoratorGenerator.createParamsDecorator("body");
export const Url = DecoratorGenerator.createParamsDecorator("url");
