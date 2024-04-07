## 安装

> npm intall waxios -D
> pnpm add waxios -D

## 创建

waxios create [dirname]

## 使用

```typescript
import { BaseRequest } from ".";
import {
  // BaseRequest,
  BaseUrl,
  Body,
  Get,
  Injectable,
  Post,
  Query,
  Url
} from "../axios/decorator";

@BaseUrl("user")
export class UserService extends BaseRequest {
  @Post("user/test")
  test(@Url id: number, @Query param: any, @Body data: any) {}
}

@BaseUrl("menu")
export class MenuService extends BaseRequest {
  @Post("menu/test")
  test(@Url id: number, @Query param: any) {}
}
```

## 引用

```jtypescript

new UserService().test(1, {type:'1'}, {name:'test'})
new MenuService().get()


```
