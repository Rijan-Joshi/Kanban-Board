export type Id = number | string;

export type Column = {
  id: Id;
  title: String;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
