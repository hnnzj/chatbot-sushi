const authenticate = require("../middleware/authenticate");
const Order = require("../models/orders.model");
const Product = require("../models/product.model");

async function setOrder(products, token) {
  try {
    const usuario = authenticate(token);
    if (!usuario) {
      return { message: "Usuario no autenticado" };
    }

    if (!products.items || products.items.length === 0) {
      return { message: "No se proporcionaron productos para la orden" };
    }
    const menu = await Product.find();
    const newProducts = products.items?.map((el) => {
      const platoEncontrado = menu.find((plato) =>
        plato.name.includes(el.product)
      );
      return {
        product: platoEncontrado,
        quantity: el.quantity,
      };
    });

    await Order.create({
      user: usuario.email,
      products: newProducts.map((el) => el),
    });
    return {
      message: `La orden fue creada con exito`,
    };
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return { message: `Hubo un error al crear la orden: ${error.message}` };
  }
}

async function showOrders({ user }, token) {
  try {
    const usuario = authenticate(token);
    const menu = await Product.find();
    if (!usuario) {
      return { message: "Usuario no autenticado" };
    }
    const orders = await Order.find({ user: usuario.email });
    let order = [];
    if (orders.length < 1) {
      return { message: "No se encontraron ordenes para este usuario" };
    }

    orders.map((el) => {
      let productos = [];
      el.products.map((item) => {
        let test = menu.find((ele) => "" + ele._id == "" + item.product);
        productos.push({ item: test, quantity: item.quantity });
      });
      order.push({ order: el, productos: productos });
    });
    const ordenes = order.map((el) => {
      return {
        orderId: el.order._id,
        ordenStatus: el.order.status,
        ordenPlato: el.productos.map((el) => {
          return {
            nombre: el.item.name,
            precio: el.item.price,
            quantity: el.quantity,
          };
        }),
      };
    });

    let response = ordenes.map((el) => {
      let total = el.ordenPlato.reduce(
        (sum, plato) => sum + plato.precio * plato.quantity,
        0
      );

      return {
        id: el.orderId,
        estado: el.ordenStatus,
        platos: el.ordenPlato.map(
          (el) =>
            "\n" +
            el.nombre +
            " - Cantidad: " +
            el.quantity +
            " - Precio: $" +
            el.precio
        ),
        total: total,
      };
    });

    return {
      message: response,
    };
  } catch (error) {
    console.error("Error al mostrar órdenes:", error);
    return { message: "Ocurrió un error al recuperar las órdenes." };
  }
}

module.exports = { setOrder, showOrders };
