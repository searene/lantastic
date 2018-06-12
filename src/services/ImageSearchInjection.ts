import * as $ from "jquery";
import "jquery-contextmenu";
import "../../node_modules/jquery-contextmenu/dist/jquery.contextMenu.min.css";

const copyTextToClipboard = (text: string) => {
  const input = document.createElement("input");
  input.setAttribute("value", text);
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
};
const registerContextMenu = () => {
  let currentClickedElement: HTMLImageElement;
  $(function() {
    $.contextMenu({
      selector: "img",
      build: (trigger, e) => {
        currentClickedElement = trigger[0] as HTMLImageElement;
      },
      items: {
        copyImageAddress: {
          name: "Copy Image Address",
          callback: (key: string, opt: any) => {
            copyTextToClipboard(currentClickedElement.src);
          }
        }
      }
    });
  });
};

registerContextMenu();
