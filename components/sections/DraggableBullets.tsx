import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import TextareaAutosize from 'react-textarea-autosize';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { AlignJustify } from "lucide-react";
import React, { useState } from "react";

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
const reorder = (list: Bullet[], startIndex: number, endIndex: number) => {
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

function Quote({ quote, index }: { quote: Bullet; index: number }) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <Card
          className="w-full  p-5 flex flex-row justify-start items-center gap-5 mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="flex" {...provided.dragHandleProps}>
            <AlignJustify className="w-4 h-4 text-slate-500" />
          </div>

          {/* <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label> */}
          <TextareaAutosize 
                      className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="eg. Implemented a new feature that resulted in 10% increase..."
          minRows={1} 
          maxRows={3} 
          />
          {/* <textarea
            id="message"
            rows={1}
            className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea> */}
        </Card>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({
  quotes,
}: {
  quotes: Bullet[];
}) {
  return quotes.map((quote: Bullet, index: number) => (
    <Quote quote={quote} index={index} key={quote.id} />
  ));
});

function QuoteApp() {
  const [state, setState] = useState<{ quotes: Bullet[] }>({ quotes: initial });

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      state.quotes,
      result.source.index,
      result.destination.index
    );

    setState({ quotes });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList quotes={state.quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const DraggableBullets = () => {
  return (
    <div>
      <QuoteApp />
    </div>
  );
};

export default DraggableBullets;
