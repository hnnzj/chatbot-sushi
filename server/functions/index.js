const takeOrder = {
  name: "cargarPedido",
  parameters: {
    type: "OBJECT",
    description:
      "Toma el pedido de un usuario, permitiendo seleccionar múltiples productos y cantidades.",
    properties: {
      items: {
        type: "ARRAY",
        description: "Lista de productos que el usuario desea pedir.",
        items: {
          type: "OBJECT",
          properties: {
            product: {
              type: "STRING",
              description: "Nombre del plato que desea pedir.",
            },
            quantity: {
              type: "NUMBER",
              description: "Cantidad del plato que desea pedir.",
            },
          },
          required: ["product", "quantity"],
        },
      },
    },
    required: ["items"],
  },
};

const showOrder = {
  name: "verOrdenes",
  parameters: {
    type: "OBJECT",
    description: `Muestra los pedidos o ordenes asociados al usuario`,
    properties: {
      user: {
        type: "STRING",
        description: "Puede estar vacio",
      },
    },
  },
};

module.exports = { takeOrder, showOrder };
