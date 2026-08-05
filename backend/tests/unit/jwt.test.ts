import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, generateTokenPair } from "@/utils/jwt";

const USER_ID = "507f1f77bcf86cd799439011";

describe("access tokens", () => {
  it("round-trips subject and role through sign/verify", () => {
    const token = signAccessToken(USER_ID, "customer");
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe(USER_ID);
    expect(payload.role).toBe("customer");
    expect(payload.type).toBe("access");
  });

  it("throws on a tampered token", () => {
    const token = signAccessToken(USER_ID, "customer");
    const tampered = token.slice(0, -2) + (token.slice(-2) === "aa" ? "bb" : "aa");
    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  it("throws on an expired token", () => {
    const expired = jwt.sign({ sub: USER_ID, role: "customer", type: "access" }, process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me", {
      expiresIn: -10,
    });
    expect(() => verifyAccessToken(expired)).toThrow();
  });
});

describe("refresh tokens", () => {
  it("round-trips tokenVersion and includes a unique jti per token", () => {
    const tokenA = signRefreshToken(USER_ID, 3);
    const tokenB = signRefreshToken(USER_ID, 3);
    const payloadA = verifyRefreshToken(tokenA);
    const payloadB = verifyRefreshToken(tokenB);

    expect(payloadA.sub).toBe(USER_ID);
    expect(payloadA.tokenVersion).toBe(3);
    expect(payloadA.type).toBe("refresh");
    expect(payloadA.jti).not.toBe(payloadB.jti);
  });
});

describe("generateTokenPair", () => {
  it("produces an access token and a refresh token that both verify for the same user", () => {
    const { accessToken, refreshToken } = generateTokenPair(USER_ID, "manager", 1);
    expect(verifyAccessToken(accessToken).sub).toBe(USER_ID);
    expect(verifyRefreshToken(refreshToken).sub).toBe(USER_ID);
    expect(verifyAccessToken(accessToken).role).toBe("manager");
  });
});
