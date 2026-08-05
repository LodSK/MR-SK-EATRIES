import { hashPassword, comparePassword, generateSecureToken, hashToken } from "@/utils/password";

describe("hashPassword / comparePassword", () => {
  it("produces a hash that verifies against the original plaintext", async () => {
    const hash = await hashPassword("Demo1234");
    expect(hash).not.toBe("Demo1234");
    await expect(comparePassword("Demo1234", hash)).resolves.toBe(true);
  });

  it("rejects the wrong password against a real hash", async () => {
    const hash = await hashPassword("Demo1234");
    await expect(comparePassword("WrongPassword1", hash)).resolves.toBe(false);
  });

  it("produces a different hash each time (random salt)", async () => {
    const [a, b] = await Promise.all([hashPassword("Demo1234"), hashPassword("Demo1234")]);
    expect(a).not.toBe(b);
  });
});

describe("generateSecureToken / hashToken", () => {
  it("returns a raw token whose hash matches hashToken(raw)", () => {
    const { raw, hashed } = generateSecureToken();
    expect(hashToken(raw)).toBe(hashed);
  });

  it("never returns the raw token equal to its own hash", () => {
    const { raw, hashed } = generateSecureToken();
    expect(raw).not.toBe(hashed);
  });

  it("generates a different token on every call", () => {
    const first = generateSecureToken();
    const second = generateSecureToken();
    expect(first.raw).not.toBe(second.raw);
  });
});
