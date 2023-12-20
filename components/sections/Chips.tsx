import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { cn } from "@lib/utils";
import { Bullet } from "@models/domain/Content";
import { SectionSchemas } from "@utils/inputSchemas";
import { ArrowLeftRight, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

export interface ChipsProps {
  formControl: Control<z.infer<SectionSchemas>, any>;
  contentIndex: number;
  bullets: Bullet[];
  onMove: (start: number, end: number) => void;
  onRemove: (index: number) => void;
  color?: string;
}

const Chips = ({
  bullets,
  onMove,
  onRemove,
  contentIndex,
  formControl,
  color,
}: ChipsProps) => {
  const isNotLastBullet = bullets.length > 1;
  const handleRemove = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    onRemove(index);
  };
  const [dragging, setDragging] = useState(false);
  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const start = result.source.index;
    const destination = result?.destination?.index;
    onMove(start, destination);
    setDragging(false);
  };

  const onDragStart = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const DisplayBadge = ({
    bullet,
    index,
  }: {
    bullet: Bullet;
    index: number;
  }) => {
    return (
      <Badge
        variant="outline"
        style={{ borderColor: color }}
        key={bullet._id}
        className="py-2 pl-3 pr-1 text-sm bg-white font-normal whitespace-nowrap"
      >
        {bullet.text}
        <XCircle
          className="ml-2 w-4 h-4 cursor-pointer hover:text-red-500 text-red-400"
          onClick={(e) => handleRemove(e, index)}
        />
      </Badge>
    );
  };

  const BulletsDisplay = () => {
    return (
      <div className="flex-row flex-wrap inline-flex items-center gap-1">
        {bullets.map((bullet, index) => (
          <DisplayBadge key={bullet._id} index={index} bullet={bullet} />
        ))}
        <Button
          type="button"
          onClick={onDragStart}
          className="h-10 text-sky-500 hover:text-sky-600"
          variant="ghost"
        >
          Reorder Skills
          <ArrowLeftRight className="w-3 h-3 ml-2" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full px-5 pb-3">
      {dragging ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="chipsDroppable" direction="horizontal">
            {(provided, snapshot) => (
              <ScrollArea>
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn("flex flex-row")}
                >
                  {bullets.map((bullet, index) => (
                    <Draggable
                      isDragDisabled={!isNotLastBullet}
                      key={bullet._id}
                      draggableId={bullet._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="mr-1"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <DisplayBadge index={index} bullet={bullet} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <BulletsDisplay />
      )}
    </div>
  );
};

export default Chips;
