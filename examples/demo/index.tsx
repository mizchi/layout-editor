import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { LayoutEditor } from "../../src";
import { sources, sampleTree, gridTree } from "./mock";

const main = document.createElement("main");
const modal = document.createElement("div");

document.body.appendChild(main);
document.body.appendChild(modal);

Modal.setAppElement(modal);
console.log("render");
ReactDOM.render(
  <LayoutEditor
    sources={sources}
    initialTree={gridTree}
    onChange={(tree) => {
      console.log("[changed]", tree);
    }}
  />,
  main
);
