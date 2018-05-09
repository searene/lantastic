import {convertToRaw} from "draft-js";
import {RichEditorPasteHandler} from "./RichEditorPasteHandler";
function test() {
  const html = `
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<div class="dp-entry" style="box-sizing: inherit; margin: 10px 0px; font-size: 20px; font-weight: 700; color: rgba(0, 0, 0, 0.87); font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">
  <div class="dsl-headwords" style="box-sizing: inherit; font-weight: bold; margin-top: 15px; margin-bottom: 10px;">
    <p style="box-sizing: inherit; margin: 0px; line-height: 1.4285em; font-weight: bold; font-size: 15px;">search</p>
  </div>
</div>
<div class="dp-definition" style="box-sizing: inherit; color: rgba(0, 0, 0, 0.87); font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">
  <div class="dsl-line" style="box-sizing: inherit;"><b class="dsl-b" style="box-sizing: inherit; font-weight: bold;">I.</b><span class="Apple-converted-space"> </span><span style="box-sizing: inherit; color: blue;"><b class="dsl-b" style="box-sizing: inherit; font-weight: bold;">search</b></span></div>
</div>
  `;
  const contentState = new RichEditorPasteHandler().getEditorStateFromHTML(html);
}
