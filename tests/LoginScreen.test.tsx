import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginScreen from "../src/screens/LoginScreen";

describe("LoginScreen", () => {
  it("deve renderizar os campos de email e senha", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Senha")).toBeTruthy();
  });

  it("deve permitir digitar email e senha", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Email");
    const senhaInput = getByPlaceholderText("Senha");

    fireEvent.changeText(emailInput, "teste@email.com");
    fireEvent.changeText(senhaInput, "123456");

    expect(emailInput.props.value).toBe("teste@email.com");
    expect(senhaInput.props.value).toBe("123456");
  });

  it("deve chamar a função de login ao clicar no botão", () => {
    const mockLogin = jest.fn();

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLogin={mockLogin} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "teste@email.com");
    fireEvent.changeText(getByPlaceholderText("Senha"), "123456");

    fireEvent.press(getByText("Entrar"));

    expect(mockLogin).toHaveBeenCalledWith("teste@email.com", "123456");
  });
});
