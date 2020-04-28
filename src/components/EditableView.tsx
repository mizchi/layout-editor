import React, { useState, useEffect, useRef } from "react";
import { Pane, Grid, Flex } from "./elements";
import { ElementTree, isLayoutElement } from "../types";
import flatten from "lodash-es/flatten";
import { EditableBox } from "./EditableBox";
import { BlankPane } from "./BlankPane";
import { View } from "./View";
import { useTreeState } from "../contexts/tree";
import { TreeEditMode } from "../reducer";
import Modal from "react-modal";

import EditorJS from "@editorjs/editorjs";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
// import Image from "@editorjs/image";

export function EditableView(props: { tree: ElementTree; depth: number }) {
  const { editMode } = useTreeState();
  const data = props.tree.data;
  const showLayoutHeader =
    editMode === TreeEditMode.ALL ||
    (isLayoutElement(data.elementType) && editMode === TreeEditMode.LAYOUT);
  const showElementHeader =
    editMode === TreeEditMode.ALL ||
    (!isLayoutElement(data.elementType) && editMode === TreeEditMode.ELEMENT);

  switch (data.elementType) {
    case "root": {
      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        />
      );
    }
    case "grid": {
      const gridAreaNames = flatten(data.areas);
      const { rows, columns, areas } = data;
      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <Grid rows={rows} columns={columns} areas={areas}>
            {gridAreaNames.map((gridArea) => {
              const hit = props.tree.children.find((c) => {
                return (
                  c.data.elementType === "grid-area" &&
                  c.data.gridArea === gridArea
                );
              })!;
              return (
                <Pane gridArea={gridArea} key={gridArea}>
                  <EditableView
                    key={hit.id}
                    tree={hit}
                    depth={props.depth + 1}
                  />
                </Pane>
              );
            })}
          </Grid>
        </EditableBox>
      );
    }
    case "grid-area": {
      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        />
      );
    }
    case "flex": {
      const isBlank = props.tree.children.length === 0;
      if (isBlank) {
        return (
          <EditableBox
            showHeader={showLayoutHeader}
            tree={props.tree}
            depth={props.depth + 1}
          >
            <Flex flexDirection={data.direction}>
              {isBlank ? (
                <BlankPane
                  parentId={props.tree.id}
                  text={`Add ${data.direction}`}
                />
              ) : (
                <View tree={props.tree} />
              )}
            </Flex>
          </EditableBox>
        );
      }

      return (
        <EditableBox
          showHeader={showLayoutHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <Flex flexDirection={data.direction}>
            <Flex flex={4} flexDirection={data.direction}>
              {props.tree.children.map((child) => {
                return (
                  <EditableView
                    key={child.id}
                    tree={child}
                    depth={props.depth + 1}
                  />
                );
              })}
            </Flex>
            <Flex flex={1}>
              <BlankPane
                parentId={props.tree.id}
                text={`Add ${data.direction}`}
              />
            </Flex>
          </Flex>
        </EditableBox>
      );
    }

    // element
    case "text": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    case "image": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <View tree={props.tree} />
        </EditableBox>
      );
    }
    case "wysiwyg": {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          <Wysiwyg />
          {/* <View tree={props.tree} /> */}
        </EditableBox>
      );
    }
    default: {
      return (
        <EditableBox
          showHeader={showElementHeader}
          tree={props.tree}
          depth={props.depth + 1}
        >
          WIP: {data.elementType}
        </EditableBox>
      );
    }
  }
}

function Wysiwyg() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Pane>
        <button onClick={() => setIsOpen(true)}>Edit by wysiwyg</button>
      </Pane>
      {isOpen && (
        <Modal
          ariaHideApp
          isOpen={true}
          onRequestClose={() => setIsOpen(false)}
        >
          <ModalContent />
        </Modal>
      )}
    </>
  );
}

function ModalContent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const editor = new EditorJS({
        /**
         * Id of Element that should contain the Editor
         */

        holderId: "editorjs",

        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        tools: {
          header: Header,
          list: List,
          // image: Image,
        },
        async onChange(api) {
          const outputData = await editor.save();
          console.log("Article data: ", outputData);
        },
        onReady() {
          console.log("editorjs ready");
        },
        autofocus: true,
      });
      // editor.blocks.clear();
    }
  }, [ref]);
  return <div ref={ref} id="editorjs"></div>;
}
