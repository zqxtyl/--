import { createAPI } from '@/utils/request'

export const list = data => createAPI('/users', 'get', data)
export const simple = data => createAPI('/users/simple', 'get', data)
// 基础题库重名，更改
export const simpleList = (data) => createAPI("/users/simple", "get", data);
export const add = data => createAPI('/users', 'post', data)
export const update = data => createAPI(`/users/${data.id}`, 'put', data)
export const remove = data => createAPI(`/users/${data.id}`, 'delete', data)
export const detail = data => createAPI(`/users/${data.id}`, 'get', data)
