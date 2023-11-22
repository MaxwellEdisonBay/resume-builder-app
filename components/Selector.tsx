import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";


export interface SelectorItem {
  text: string;
  key: string;
}

export interface SelectorProps {
  items: SelectorItem[];
  label: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  value: string | undefined;
}

const Selector = ({
  items,
  onValueChange,
  value,
  label,
  placeholder,
}: SelectorProps) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger id={label.toLowerCase()}>
          <SelectValue placeholder={placeholder || "Select"} />
        </SelectTrigger>
        <SelectContent position="popper">
          {items.map((item) => (
            <SelectItem value={item.key} key={item.key}>
              {item.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Selector;
