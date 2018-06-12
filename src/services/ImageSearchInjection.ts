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
const selectElement = (element: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  getSelection().removeAllRanges();
  getSelection().addRange(range);
};
const wrapElementInDiv = (element: HTMLElement) => {

};
const copyImageToClipboard = (imgElement: HTMLImageElement) => {
  $(imgElement).wrap("<div></div>");
  const divElement = imgElement.parentElement;
  divElement.setAttribute("contenteditable", "true");
  selectElement(divElement);
  document.execCommand("copy");
  getSelection().removeAllRanges();
  divElement.setAttribute("contenteditable", "false")
  $(imgElement).unwrap();
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
        },
        copyImage: {
          name: "Copy Image",
          callback: (key: string, opt: any) => {
            setTimeout(() => {
              copyImageToClipboard(currentClickedElement);
            }, 1000);
          }
        }
      }
    });
  });
};

registerContextMenu();
