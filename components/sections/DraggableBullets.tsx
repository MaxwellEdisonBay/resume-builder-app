import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import TextareaAutosize from "react-textarea-autosize";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { AlignJustify, Delete } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@components/ui/button";
import mongoose from "mongoose";
import cloneDeep from "lodash.clonedeep";

interface Bullet {
  id: string;
  content: string;
}

const initial = Array.from({ length: 3 }, (v, k) => k).map((k) => {
  const custom: Bullet = {
    id: `id-bullets-${k}`,
    content: `Quote ${k}`,
  };

  return custom;
});

const grid = 8;
const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

//   const QuoteItem = styled.div`
//     width: 200px;
//     border: 1px solid grey;
//     margin-bottom: ${grid}px;
//     background-color: lightblue;
//     padding: ${grid}px;
//   `;

function Bullet({ bullet, index, bulletId }: { bullet: string; index: number, bulletId:string }) {
  return (
    <Draggable draggableId={bulletId} index={index}>
      {(provided) => (
        <Card
          className="w-full  p-5 flex flex-row justify-start items-center gap-5 mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="flex" {...provided.dragHandleProps}>
            <AlignJustify className="w-4 h-4 text-slate-500" />
          </div>

          <TextareaAutosize
            value={bullet}
            onChange={() => {}}
            className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="eg. Implemented a new feature that resulted in 10% increase..."
            minRows={1}
            maxRows={3}
          />
          <Button
            className="hover:text-red-600 text-red-400"
            variant="ghost"
            size="icon"
          >
            <Delete className="w-5 h-5 " />
          </Button>
        </Card>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({
  // const QuoteList = (function QuoteList({
  bullets,
}: {
  bullets: string[];
}) {
  return bullets.map((bullet: string, index: number) => {
    const bulletId = new mongoose.Types.ObjectId().toString()
    return (
      <Bullet bullet={bullet} index={index} key={bulletId} bulletId={bulletId}/>
    )
  });
});

function QuoteApp({bullets} : {bullets: string[]}) {
  // const [state, setState] = useState<{ quotes: Bullet[] }>({ quotes: initial });
  const [localBullets, setLocalBullets] = useState<string[]>(bullets);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newBullets = reorder(
      localBullets,
      result.source.index,
      result.destination.index
    );

    setLocalBullets(newBullets);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList bullets={localBullets} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Button onClick={() => {
        setLocalBullets((oldBullets) => {
          const newBullets = cloneDeep(oldBullets)
          newBullets.push("")
          return newBullets
        })
        console.log(localBullets)
      }
      }>Add Bullet Point</Button>
    </DragDropContext>
  );
}

const DraggableBullets = ({bullets} : {bullets : string[]}) => {
  return (
    <div>
      <QuoteApp bullets={bullets}/>
    </div>
  );
};

export default DraggableBullets;
