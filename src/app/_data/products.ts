export async function getProducts({ id, name }: { id: string | undefined; name: string| undefined }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let products = [
    { id: "5c3r4d3f", name: "Blue Table", price: 52.39 },
    { id: "b2n7r8m5", name: "Black Chair", price: 48.62 },
    { id: "f8g4d1h3", name: "Red Lamp", price: 43.12 },
    { id: "k9s5d1t7", name: "Silver Clock", price: 59.57 },
    { id: "w5q2r1g8", name: "Purple Bookshelf", price: 67.83 },
    { id: "x3t9k8p2", name: "Green Sofa", price: 33.73 },
    { id: "d4f9j8a2", name: "Gold Desk", price: 24.58 },
    { id: "m7b1n9s6", name: "Yellow Vase", price: 26.72 },
    { id: "i2y6t8o7", name: "White Lamp", price: 21.89 },
    { id: "a4v7e3c6", name: "Orange Clock", price: 32.4 },
    { id: "o6u2p4z9", name: "Black Mirror", price: 60.35 },
  ];

  if (id) {
    products = products.filter((product) => product.id.includes(id));
  }

  if (name) {
    products = products.filter((product) => product.name.includes(name));
  }


  return products
}

interface CreateProductProps {
  name: string;
  price: number;
}

export async function createProduct(data: CreateProductProps) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return;
}
