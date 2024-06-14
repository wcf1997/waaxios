import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Injectable } from "../decorator";
type BaseRequestConfig<T = any> = AxiosRequestConfig & {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  responseInterceptor?: (res: T) => T;
};
function getProtoData(target: any) {
  return target.__proto__;
}
@Injectable()
export abstract class BaseRequest<T = any> {
  [x: string]: any;
  rootUrl: string = "http:192.168.0.1";
  baseUrl: string = "";
  timeout: number = 60000;
  _axios: AxiosInstance;
  constructor() {
    this.baseUrl = getProtoData(this).baseUrl || this.baseUrl;
    this.rootUrl = getProtoData(this).rootUrl || this.rootUrl;
    // 1、创建axios实例
    this._axios = axios.create({
      baseURL: this.rootUrl,
      timeout: this.timeout
    });

    // 2、添加所有接口拦截器
    // 使用拦截器
    // 2.添加所有的实例都有的拦截器
    this._axios.interceptors.request.use(
      config => {
        // const userInfo = cache.getSSCache("user") || {};
        // if (userInfo.tokenvalue) {
        //   config.headers[userInfo.tokenname] = userInfo.tokenvalue;
        // }
        // if (userInfo.wxlsToken) {
        //   if (!config.headers.Authorization) {
        //     config.headers["Authorization"] = "bearer " + userInfo.wxlsToken;
        //   }
        // }

        return config;
      },
      err => {
        return err;
      }
    );

    this._axios.interceptors.response.use(
      res => {
        // const router = useRouter()
        // 将loading移除
        // this.loading?.clear();
        // Toast.hide()

        if (res.status === 200 && !res.data.success) {
          // showDialog({
          //   teleport: "body",
          //   closeOnClickOverlay: true,
          //   message: res.data.message
          // }).then(() => {});

          if (res.data.code === "401") {
            // 未登录/登陆过期拦截
          }
        }

        return res.status === 200
          ? Promise.resolve(res.data)
          : Promise.reject(res);
      },
      err => {
        // 将loading移除
        this.loading?.clear();
        // Toast.hide()
        if (err && err.response) {
          // notification.add({
          //   type: 'error',
          //   message: errorMessage[err.response.status]
          // })
          // showDialog({
          //   teleport: "body",
          //   closeOnClickOverlay: true,
          //   message: errorMessage[err.response.status]
          // }).then(() => {});
        } else {
          // 网络超时
          // showDialog({
          //   teleport: "body",
          //   closeOnClickOverlay: true,
          //   message: "网络连接超时，请稍后重试！"
          // }).then(() => {});
        }
        return Promise.reject(err);
      }
    );
  }

  public get<T>(
    params?: any,
    config?: BaseRequestConfig
  ): Promise<AxiosResponse<T, any>> {
    console.log("config", config);

    return this.request({
      method: "get",
      url: config?.url || this.baseUrl,
      params,
      ...config
    });
  }

  public post<T>(
    data?: any,
    config?: BaseRequestConfig
  ): Promise<AxiosResponse<T, any>> {
    return this.request({
      method: "post",
      url: config?.url || this.baseUrl,
      data,
      ...config
    });
  }

  public put<T>(
    data?: any,
    config?: BaseRequestConfig
  ): Promise<AxiosResponse<T, any>> {
    return this.request({
      method: "put",
      url: config?.url || this.baseUrl,
      data,
      ...config
    });
  }

  public delete<T>(
    data?: any,
    config?: BaseRequestConfig
  ): Promise<AxiosResponse<T, any>> {
    return this.request({
      method: "delete",
      url: config?.url || this.baseUrl,
      data,
      ...config
    });
  }

  public request<T>(config: BaseRequestConfig): Promise<AxiosResponse<T, any>> {
    return new Promise((resolve, reject) => {
      // 1、处理自定义请求拦截
      if (config.requestInterceptor) {
        config = config.requestInterceptor(config);
      }
      // 2、处理自定义响应拦截
      this._axios
        .request(config)
        .then(res => {
          if (config.responseInterceptor) {
            res = config.responseInterceptor(res);
          }

          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
