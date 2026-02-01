import Field from "./Field";

type File = {
    id: string;
    title: string;
    last_modified: string;
    fields?: Array<Field>;
}
export default File;