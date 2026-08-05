import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Popular</Badge>);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("defaults to the primary variant's classes", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-brand-primary");
  });

  it("applies the spicy variant's classes when requested", () => {
    render(<Badge variant="spicy">Hot</Badge>);
    expect(screen.getByText("Hot")).toHaveClass("bg-red-500/15");
  });

  it("renders an icon alongside the label", () => {
    render(
      <Badge icon={<svg data-testid="badge-icon" />} variant="success">
        Available
      </Badge>
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("merges a custom className without dropping variant classes", () => {
    render(
      <Badge variant="outline" className="mt-4">
        Custom
      </Badge>
    );
    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("border");
    expect(badge).toHaveClass("mt-4");
  });
});
