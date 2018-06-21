import * as fse from "fs-extra";
import * as path from "path";
export class AppCache {
  public static webviewCSS: string;
  public static init = async () => {
    await AppCache.initWebviewCSS();
  };
  public static initWebviewCSS = async () => {
    AppCache.webviewCSS = await fse.readFile(path.resolve(__dirname, "css/dictionary.css"), "UTF-8");
  };
}