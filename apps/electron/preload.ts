import { contextBridge, shell } from 'electron';

contextBridge.exposeInMainWorld('jrpm', {
  versions: process.versions,
  openExternal: (url: string) => shell.openExternal(url)
});