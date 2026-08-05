import { connectDatabase, disconnectDatabase } from "@/database/connect";
import { env } from "@/config/env";
import { hashPassword } from "@/utils/password";
import { slugify } from "@/utils/slugify";
import { generateReservationNumber } from "@/services/reservation.service";
import {
  User,
  Category,
  MenuItem,
  Order,
  Reservation,
  Coupon,
  Review,
  Notification,
  Settings,
} from "@/models";
import {
  MENU_ITEM_SEEDS,
  CATEGORY_SEEDS,
  COUPON_SEEDS,
  randomFullName,
  randomFrom,
  randomInt,
  randomDateWithinDays,
  randomReviewComment,
} from "@/seed/seedData";
import { DELIVERY_METHODS, PAYMENT_METHODS, ORDER_STATUSES, RESERVATION_STATUSES, DELIVERY_FEES } from "@/config/constants";

async function seed() {
  await connectDatabase();
  console.log("[seed] Clearing existing collections…");

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    MenuItem.deleteMany({}),
    Order.deleteMany({}),
    Reservation.deleteMany({}),
    Coupon.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  // ── Categories ─────────────────────────────────────────────
  console.log("[seed] Categories…");
  await Category.insertMany(CATEGORY_SEEDS);

  // ── Menu items ─────────────────────────────────────────────
  console.log(`[seed] Menu items (${MENU_ITEM_SEEDS.length})…`);
  const menuItems = await MenuItem.insertMany(
    MENU_ITEM_SEEDS.map((item) => ({
      ...item,
      slug: slugify(item.name),
      longDescription: `${item.description} Prepared fresh in-house using seasonal ingredients.`,
      currency: "GHS",
      rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
      reviewCount: randomInt(20, 250),
      prepTimeMinutes: randomInt(10, 30),
      popularityScore: randomInt(40, 99),
      stockQuantity: randomInt(20, 200),
      ingredients: ["Fresh herbs", "House seasoning", "Seasonal produce", "Signature sauce"],
      nutrition: {
        calories: randomInt(250, 900),
        proteinGrams: randomInt(5, 50),
        carbsGrams: randomInt(10, 90),
        fatGrams: randomInt(5, 45),
      },
    }))
  );

  // ── Users ──────────────────────────────────────────────────
  console.log("[seed] Users…");
  const adminPassword = await hashPassword(env.admin.seedPassword);
  const demoPassword = await hashPassword("Demo1234");

  await User.create({
    fullName: "MR_SK Admin",
    email: env.admin.seedEmail,
    password: adminPassword,
    role: "admin",
    isEmailVerified: true,
  });

  await User.create({
    fullName: "Linda Asante",
    email: "manager@mrsk-eatries.com",
    password: demoPassword,
    role: "manager",
    isEmailVerified: true,
  });

  await User.create({
    fullName: "Daniel Owusu",
    email: "staff@mrsk-eatries.com",
    password: demoPassword,
    role: "staff",
    isEmailVerified: true,
  });

  const demoCustomer = await User.create({
    fullName: "Ama Owusu",
    email: "demo@mrsk-eatries.com",
    password: demoPassword,
    role: "customer",
    isEmailVerified: true,
    addresses: [{ label: "Home", street: "12 Independence Avenue", city: "Accra", isDefault: true }],
  });

  const customers = await User.insertMany(
    Array.from({ length: 16 }).map((_, i) => ({
      fullName: randomFullName(),
      email: `customer${i + 1}@example.com`,
      password: demoPassword,
      role: "customer",
      isEmailVerified: Math.random() > 0.2,
      addresses: [{ label: "Home", street: `${randomInt(1, 99)} Ring Road`, city: "Accra", isDefault: true }],
    }))
  );

  const allCustomers = [demoCustomer, ...customers];
  console.log(`[seed] Users created: ${await User.countDocuments()} total`);

  // ── Coupons ────────────────────────────────────────────────
  console.log("[seed] Coupons…");
  await Coupon.insertMany(COUPON_SEEDS);

  // ── Orders ─────────────────────────────────────────────────
  console.log("[seed] Orders (30)…");
  for (let i = 0; i < 30; i++) {
    const orderMenuItemCount = randomInt(1, 4);
    const orderMenuItems: (typeof menuItems)[number][] = [];
    for (let j = 0; j < orderMenuItemCount; j++) {
      orderMenuItems.push(randomFrom(menuItems));
    }
    const items = orderMenuItems.map((item) => ({
      menuItem: item._id,
      name: item.name,
      price: item.price,
      quantity: randomInt(1, 3),
      currency: item.currency,
    }));
    const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
    const deliveryMethod = randomFrom([...DELIVERY_METHODS]);
    const deliveryFee = DELIVERY_FEES[deliveryMethod];
    const serviceCharge = Math.round(subtotal * 0.05 * 100) / 100;
    const tax = Math.round(subtotal * 0.125 * 100) / 100;
    const grandTotal = Math.round((subtotal + deliveryFee + serviceCharge + tax) * 100) / 100;
    const customer = randomFrom(allCustomers);

    await Order.create({
      orderNumber: `MRSK-${100000 + i}`,
      user: customer._id,
      items,
      subtotal,
      discount: 0,
      deliveryFee,
      serviceCharge,
      tax,
      grandTotal,
      deliveryMethod,
      paymentMethod: randomFrom([...PAYMENT_METHODS]),
      status: randomFrom([...ORDER_STATUSES]),
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: "+233200000000",
      deliveryAddress:
        deliveryMethod !== "pickup" ? { street: "12 Ring Road", city: "Accra" } : undefined,
      estimatedDeliveryMinutes: deliveryMethod === "standard" ? [35, 50] : [15, 25],
      createdAt: randomDateWithinDays(60),
    });
  }

  // ── Reservations ───────────────────────────────────────────
  console.log("[seed] Reservations (20)…");
  const TIME_SLOTS = ["12:00", "12:30", "13:00", "18:00", "18:30", "19:00", "19:30", "20:00"];
  for (let i = 0; i < 20; i++) {
    const customer = randomFrom(allCustomers);
    const date = new Date();
    date.setDate(date.getDate() + randomInt(-10, 20));
    date.setHours(0, 0, 0, 0);

    await Reservation.create({
      reservationNumber: generateReservationNumber(),
      user: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: "+233200000000",
      partySize: randomInt(1, 8),
      date,
      time: randomFrom(TIME_SLOTS),
      status: randomFrom([...RESERVATION_STATUSES]),
    });
  }

  // ── Reviews ────────────────────────────────────────────────
  console.log("[seed] Reviews…");
  const reviewedPairs = new Set<string>();
  let reviewCount = 0;
  while (reviewCount < 60) {
    const customer = randomFrom(allCustomers);
    const item = randomFrom(menuItems);
    const key = `${customer._id}-${item._id}`;
    if (reviewedPairs.has(key)) continue;
    reviewedPairs.add(key);

    await Review.create({
      user: customer._id,
      menuItem: item._id,
      rating: randomInt(3, 5),
      comment: randomReviewComment(),
    });
    reviewCount++;
  }

  // ── Notifications (for the demo customer) ─────────────────
  console.log("[seed] Notifications…");
  await Notification.insertMany([
    {
      user: demoCustomer._id,
      type: "order",
      title: "Order Confirmed",
      message: "Your order MRSK-100001 has been confirmed.",
      isRead: false,
    },
    {
      user: demoCustomer._id,
      type: "promo",
      title: "New Coupon Available",
      message: "Use WELCOME10 for 10% off your next order.",
      isRead: true,
    },
  ]);

  // ── Settings ───────────────────────────────────────────────
  console.log("[seed] Settings…");
  await Settings.create({
    openingHours: [
      { days: "Monday — Thursday", time: "8:00 AM — 10:00 PM" },
      { days: "Friday — Saturday", time: "8:00 AM — 12:00 AM" },
      { days: "Sunday", time: "9:00 AM — 9:00 PM" },
    ],
  });

  console.log("\n[seed] Done.");
  console.log(`[seed]   Admin login:    ${env.admin.seedEmail} / ${env.admin.seedPassword}`);
  console.log(`[seed]   Manager login:  manager@mrsk-eatries.com / Demo1234`);
  console.log(`[seed]   Staff login:    staff@mrsk-eatries.com / Demo1234`);
  console.log(`[seed]   Customer login: demo@mrsk-eatries.com / Demo1234`);
  console.log(`[seed]   Sample coupons: WELCOME10, MRSK20, EATRIES15, FLAT20`);

  await disconnectDatabase();
  process.exit(0);
}

seed().catch((error) => {
  console.error("[seed] Failed:", error);
  process.exit(1);
});
