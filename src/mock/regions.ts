export interface NormPoint {
  x: number;
  y: number;
}

export const mockRegions = [
  {
    regionId: "regionA",
    name: "区域 A",
    polygon: [
      { x: 90 / 600, y: 80 / 400 },
      { x: 160 / 600, y: 60 / 400 },
      { x: 230 / 600, y: 100 / 400 },
      { x: 210 / 600, y: 160 / 400 },
      { x: 140 / 600, y: 170 / 400 },
      { x: 80 / 600, y: 130 / 400 },
    ],
  },
  {
    regionId: "regionB",
    name: "区域 B",
    polygon: [
      { x: 380 / 600, y: 70 / 400 },
      { x: 460 / 600, y: 70 / 400 },
      { x: 520 / 600, y: 120 / 400 },
      { x: 460 / 600, y: 170 / 400 },
      { x: 380 / 600, y: 170 / 400 },
      { x: 340 / 600, y: 120 / 400 },
    ],
  },
  {
    regionId: "regionC",
    name: "区域 C",
    polygon: [
      { x: 300 / 600, y: 230 / 400 },
      { x: 360 / 600, y: 300 / 400 },
      { x: 300 / 600, y: 360 / 400 },
      { x: 240 / 600, y: 300 / 400 },
    ],
  },
];
