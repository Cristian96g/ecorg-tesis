const mockPoints = [
  {
    _id: 1,
    name: "Punto Verde - Centro",
    location: { type: "Point", coordinates: [-69.216, -51.623] }, // lng, lat
    types: ["plastico", "vidrio"]
  },
  {
    _id: 2,
    name: "Punto Verde - San Benito",
    location: { type: "Point", coordinates: [-69.240, -51.635] },
    types: ["papel", "pilas"]
  },
  {
    _id: 3,
    name: "Punto Verde - Chimen Aike",
    location: { type: "Point", coordinates: [-69.200, -51.650] },
    types: ["aceite", "plastico"]
  }
];

export default mockPoints;
