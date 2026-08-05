import { loginSchema, registerSchema, resetPasswordSchema } from "./auth";

describe("loginSchema", () => {
  it("trims and lowercases the email before validating", () => {
    const result = loginSchema.safeParse({ email: "  Ama@Example.COM  ", password: "x", rememberMe: false });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("ama@example.com");
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x", rememberMe: false });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "ama@example.com", password: "", rememberMe: false });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    fullName: "Ama Owusu",
    email: "ama@example.com",
    password: "Demo1234",
    confirmPassword: "Demo1234",
    agreeToTerms: true,
  };

  it("accepts a fully valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: "Different1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
    }
  });

  it("rejects a password missing an uppercase letter", () => {
    const result = registerSchema.safeParse({ ...valid, password: "demo1234", confirmPassword: "demo1234" });
    expect(result.success).toBe(false);
  });

  it("rejects a password missing a number", () => {
    const result = registerSchema.safeParse({ ...valid, password: "DemoDemo", confirmPassword: "DemoDemo" });
    expect(result.success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    const result = registerSchema.safeParse({ ...valid, password: "Dem1", confirmPassword: "Dem1" });
    expect(result.success).toBe(false);
  });

  it("requires agreeToTerms to be true", () => {
    const result = registerSchema.safeParse({ ...valid, agreeToTerms: false });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching strong passwords", () => {
    const result = resetPasswordSchema.safeParse({ password: "NewPass12", confirmPassword: "NewPass12" });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords with the error on confirmPassword", () => {
    const result = resetPasswordSchema.safeParse({ password: "NewPass12", confirmPassword: "Other123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
    }
  });
});
