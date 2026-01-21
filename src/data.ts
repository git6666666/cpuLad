export type CPU = {
  name: string;
  year: number;
  openSpeed: number; // 网页打开速度（越大越快）
  price: number;     // 价格（同一货币单位即可）
};

export const cpus: CPU[] = [
  { name: "Ryzen 7 7800X3D", year: 2023, openSpeed: 980, price: 2699 },
  { name: "Core i5-13600K",  year: 2022, openSpeed: 920, price: 1999 },
  { name: "Ryzen 5 5600",    year: 2020, openSpeed: 620, price: 799  },
  { name: "Core i3-12100F",  year: 2022, openSpeed: 580, price: 699  }
];
