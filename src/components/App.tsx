import React, { useContext } from "react";
import { EditableView } from "./EditableView";
import { EditModeButtonGroup } from "./EditModeButtonGroup";
import { ElementPropsEditor } from "./ElementPropsEditor";
import { Flex, Pane } from "./elements";
import { SourceList } from "./SourceList";
import { View } from "./View";
import { PropsContext } from "../contexts/props";
import { TreeStateProvider, useTreeState } from "../contexts/tree";
import { TreeEditMode } from "../reducer";
import { Props } from "../types";

function EditableRootTree() {
  const { tree } = useTreeState();
  return <EditableView tree={tree} depth={0} />;
}

function PreviewRootTree() {
  const { tree } = useTreeState();
  return <View tree={tree} />;
}

function OutputTree() {
  const { tree } = useTreeState();
  return (
    <Pane height="80vh" overflow="auto">
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </Pane>
  );
}

function SelectedModeTree() {
  const { editMode } = useTreeState();
  switch (editMode) {
    case TreeEditMode.ALL:
    case TreeEditMode.ELEMENT:
    case TreeEditMode.LAYOUT: {
      return (
        <Flex flex={1}>
          <EditableRootTree />
        </Flex>
      );
    }
    case TreeEditMode.PREVIEW: {
      return (
        <Flex flex={1}>
          <PreviewRootTree />
        </Flex>
      );
    }
    case TreeEditMode.OUTPUT: {
      return (
        <Flex flex={1}>
          <OutputTree />
        </Flex>
      );
    }
  }
}

function AppImpl() {
  const props = useContext(PropsContext);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html, body, main {padding: 0; margin: 0; width: 100vw; height: 100vh; }
          * { box-sizing: border-box; }
        `,
        }}
      />
      <TreeStateProvider
        onChange={props.onChange}
        initialTree={props.initialTree}
      >
        <Flex flexDirection="column">
          <Flex display="flex" flex={1}>
            <Flex>
              <Pane width={300}>
                <SourceList />
              </Pane>
              {/* Tree */}
              <Pane flex={1} padding={10}>
                <Flex flexDirection="column">
                  <Flex height={32}>
                    <EditModeButtonGroup />
                  </Flex>
                  <Flex height="calc(100% - 32px)">
                    <SelectedModeTree />
                  </Flex>
                </Flex>
              </Pane>
            </Flex>
            <Pane width={300}>
              <ElementPropsEditor />
            </Pane>
          </Flex>
        </Flex>
      </TreeStateProvider>
    </>
  );
}

export function App(props: Props) {
  return (
    <PropsContext.Provider value={props}>
      <AppImpl />
    </PropsContext.Provider>
  );
}
