import React from "react";
import { render } from "@testing-library/react-native";
import HistoricoLimpezasScreen from "../src/screens/HistoricoLimpezasScreen";

jest.mock("../src/hooks/useAuth", () => ({
  useAuth: () => ({ user: { username: "teste" }, token: "fake-token" }),
}));

describe("HistoricoLimpezasScreen", () => {
  it("renderiza a lista de limpezas corretamente", async () => {
    const { getByText } = render(<HistoricoLimpezasScreen />);
    expect(getByText("Histórico de Limpezas")).toBeTruthy();
  });
});
