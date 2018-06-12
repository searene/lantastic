import * as $ from "jquery";
import "jquery-contextmenu";
import "../../node_modules/jquery-contextmenu/dist/jquery.contextMenu.min.css";

const copyToClipboard = (text: string) => {
  const input = document.createElement("input");
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand("copy");
  document.body.removeChild(input)
  return result;
}
const registerContextMenu = () => {
  $(function() {
    $.contextMenu({
      selector: "img",
      callback: function(key, options) {
        copyToClipboard(key);
      },
      items: {
        copyImageAddress: {name: "Copy Image Address"}
      }
    });
  });
}

registerContextMenu();
