
import Delta from "quill/node_modules/quill-delta/dist/Delta";

export type note = {
    id: number;
    name: string;
    category: string;
    delta: Delta;
};