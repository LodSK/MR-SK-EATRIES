import { render, screen } from "@testing-library/react";
import { PriceTag } from "./PriceTag";

describe("PriceTag", () => {
  it("renders the currency and price", () => {
    render(<PriceTag price={89} currency="GHS" />);
    expect(screen.getByText("GHS 89")).toBeInTheDocument();
  });

  it("does not render a struck-through original price when none is given", () => {
    render(<PriceTag price={89} currency="GHS" />);
    expect(screen.queryByText(/line-through/)).not.toBeInTheDocument();
  });

  it("renders the original price struck through when it is higher than price", () => {
    render(<PriceTag price={45} currency="GHS" originalPrice={60} />);
    expect(screen.getByText("GHS 45")).toBeInTheDocument();
    expect(screen.getByText("GHS 60")).toHaveClass("line-through");
  });

  it("does not show an original price that is not actually higher (data guard)", () => {
    render(<PriceTag price={60} currency="GHS" originalPrice={60} />);
    expect(screen.queryByText("GHS 60", { selector: ".line-through" })).not.toBeInTheDocument();
  });

  it("applies the requested size class", () => {
    render(<PriceTag price={89} currency="GHS" size="lg" />);
    expect(screen.getByText("GHS 89")).toHaveClass("text-2xl");
  });
});
