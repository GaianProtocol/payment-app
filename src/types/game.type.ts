export type IGame = {
  id: number;
  url: string;
  image: string;
  gameName: string;
  gameType: string;
  description: string;
};


export type Option = {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
  value: number;
  description?: string;
}

export type ItemGame = {
  item: {
    name: string;
  };
  quantity: number;
};