import { OrderProduct, OrderStore } from "../../models/Order";
import { Product, ProductStore } from "../../models/Product";
import { User, UserStore } from "../../models/User";

const store = new OrderStore();

describe("OrderStore Model", () => {
  let user: User;
  let product: Product;

  beforeEach(async () => {
    user = await new UserStore().create({
      firstname: "firstName",
      lastname: "lastName",
      password: "password"
    });
    product = await new ProductStore().create({
      name: "product",
      price: 10
    });
  });

  it("should have all CRUD methods", () => {
    expect(store.createOrder).toBeDefined();
    expect(store.getCurrentOrderById).toBeDefined();
    expect(store.getCompletedOrdersByUserId).toBeDefined();
    expect(store.addProduct).toBeDefined();
  });

  it("should create a new order", async () => {
    const orderProduct: OrderProduct = {
      product_id: product.id ?? -1,
      quantity: 2
    };

    const createdOrder = await store.createOrder({
      user_id: user.id ?? -111,
      products: [orderProduct]
    });

    expect(createdOrder).toBeDefined();
    expect(createdOrder.id).toBeDefined();
    expect(createdOrder.user_id).toBe(user.id ?? -11);
    expect(createdOrder.order_status).toBe("active");
    expect(createdOrder.products[0].product_id).toBe(orderProduct.product_id);
    expect(createdOrder.products[0].quantity).toBe(orderProduct.quantity);
  });

  it("should get the current order by user ID", async () => {
    const orderProduct: OrderProduct = {
      product_id: product.id ?? -1,
      quantity: 2
    };

    await store.createOrder({
      user_id: user.id ?? -111,
      products: [orderProduct]
    });
    const order = await store.getCurrentOrderById(user.id ?? -1);
    expect(order).toBeDefined();
    expect(order.user_id).toBe(user.id ?? -11111);
    expect(order.order_status).toBe("active");
    expect(order.products[0].product_id).toBe(orderProduct.product_id);
    expect(order.products[0].quantity).toBe(orderProduct.quantity);
  });

  it("should add product to an existing order", async () => {
    const orderProduct: OrderProduct = {
      product_id: product.id ?? -1,
      quantity: 2
    };

    const order = await store.createOrder({
      user_id: user.id ?? -111,
      products: [orderProduct]
    });
    
    const product1 = await new ProductStore().create({
      name: "product",
      price: 10
    });

    const orderProduct2: OrderProduct = {
      product_id: product1.id ?? -112,
      quantity: 22
    }

    const orderProductAdded = await store.addProduct(order.id || 123123, orderProduct2);

    expect(orderProductAdded).toBeDefined();
    expect(orderProductAdded.product_id).toEqual(orderProduct2.product_id);
    expect(orderProductAdded.quantity).toEqual(orderProduct2.quantity);
  })
});
