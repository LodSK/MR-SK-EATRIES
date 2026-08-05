import mongoose, { Types } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Order } from "@/models/Order.model";
import { getOrderById, getOrderByNumber } from "@/services/order.service";
import { ApiError } from "@/utils/ApiError";

/**
 * Regression test for the guest order-lookup over-exposure documented in
 * PROJECT_STATUS.md since the Sprint 9 audit and fixed in the "UI
 * Completion Sprint": GET /orders/:id (and later /orders/track/:orderNumber)
 * used to return a complete order to ANY unauthenticated request that had
 * or guessed the id/order number. Runs against a real, in-memory MongoDB —
 * not mocks — so it exercises the actual assertCanAccess logic inside
 * order.service.ts, not a re-implementation of it.
 */

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Order.deleteMany({});
});

const baseItem = {
  menuItem: new Types.ObjectId(),
  name: "BBQ Chicken Pizza",
  price: 89,
  quantity: 1,
  currency: "GHS",
};

async function createAccountOrder(userId: Types.ObjectId) {
  return Order.create({
    orderNumber: "ORD-ACCOUNT1",
    user: userId,
    items: [baseItem],
    subtotal: 89,
    grandTotal: 89,
    deliveryMethod: "standard",
    paymentMethod: "cash",
    customerName: "Ama Owner",
    customerEmail: "ama@example.com",
    customerPhone: "+233000000000",
  });
}

async function createGuestOrder() {
  return Order.create({
    orderNumber: "ORD-GUEST001",
    guestEmail: "guest@example.com",
    items: [baseItem],
    subtotal: 89,
    grandTotal: 89,
    deliveryMethod: "pickup",
    paymentMethod: "cash",
    customerName: "Kofi Guest",
    customerEmail: "guest@example.com",
    customerPhone: "+233111111111",
  });
}

describe("order.service access scoping (getOrderById)", () => {
  it("allows the owning customer", async () => {
    const userId = new Types.ObjectId();
    const order = await createAccountOrder(userId);
    const result = await getOrderById(order.id, { userId: userId.toString(), role: "customer" });
    expect(result.orderNumber).toBe("ORD-ACCOUNT1");
  });

  it("rejects a different authenticated customer", async () => {
    const owner = new Types.ObjectId();
    const stranger = new Types.ObjectId();
    const order = await createAccountOrder(owner);
    await expect(getOrderById(order.id, { userId: stranger.toString(), role: "customer" })).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("allows staff to bypass ownership", async () => {
    const owner = new Types.ObjectId();
    const order = await createAccountOrder(owner);
    const result = await getOrderById(order.id, { userId: new Types.ObjectId().toString(), role: "staff" });
    expect(result.orderNumber).toBe("ORD-ACCOUNT1");
  });

  it("allows a guest with the matching email", async () => {
    const order = await createGuestOrder();
    const result = await getOrderById(order.id, { email: "guest@example.com" });
    expect(result.orderNumber).toBe("ORD-GUEST001");
  });

  it("rejects a guest with the wrong email", async () => {
    const order = await createGuestOrder();
    await expect(getOrderById(order.id, { email: "someone-else@example.com" })).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("REGRESSION: rejects a fully unauthenticated request with no email at all", async () => {
    const order = await createGuestOrder();
    await expect(getOrderById(order.id, {})).rejects.toMatchObject({ statusCode: 403 });
  });

  it("REGRESSION: an account-owned order cannot be accessed by guessing an email — it has no guestEmail to match", async () => {
    const owner = new Types.ObjectId();
    const order = await createAccountOrder(owner);
    await expect(getOrderById(order.id, { email: "ama@example.com" })).rejects.toMatchObject({ statusCode: 403 });
  });

  it("throws 404, not a cast error, for a well-formed but non-existent id", async () => {
    const fakeId = new Types.ObjectId().toString();
    await expect(getOrderById(fakeId, {})).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("order.service access scoping (getOrderByNumber — Track Order page)", () => {
  it("allows a guest with the matching email, by order number", async () => {
    await createGuestOrder();
    const result = await getOrderByNumber("ORD-GUEST001", { email: "guest@example.com" });
    expect(result.orderNumber).toBe("ORD-GUEST001");
  });

  it("REGRESSION: rejects an unauthenticated lookup by order number with no email", async () => {
    await createGuestOrder();
    await expect(getOrderByNumber("ORD-GUEST001", {})).rejects.toBeInstanceOf(ApiError);
    await expect(getOrderByNumber("ORD-GUEST001", {})).rejects.toMatchObject({ statusCode: 403 });
  });
});
